import { db } from './config';
import { 
  collection, getDocs, doc, setDoc, addDoc, updateDoc, deleteDoc, getDoc 
} from 'firebase/firestore';

// ----------------------------------------------------
// DATABASE SERVICES (PURE CLOUD FIRESTORE LAYER)
// ----------------------------------------------------

// 1. RESOURCES COLLECTION CRUD
export const getResources = async () => {
  try {
    const q = collection(db, 'resources');
    const snap = await getDocs(q);
    const list = [];
    snap.forEach(doc => {
      list.push({ id: doc.id, ...doc.data() });
    });
    return list;
  } catch (e) {
    console.error("Firestore getResources error:", e);
    return [];
  }
};

export const addResource = async (resourceData) => {
  const newResource = {
    ...resourceData,
    downloads: 0,
    id: `r-${Date.now()}`
  };

  try {
    const docRef = await addDoc(collection(db, 'resources'), newResource);
    return { id: docRef.id, ...newResource };
  } catch (e) {
    console.error("Firestore addResource error:", e);
    throw e;
  }
};

export const deleteResource = async (id) => {
  try {
    await deleteDoc(doc(db, 'resources', id));
    return true;
  } catch (e) {
    console.error("Firestore deleteResource error:", e);
    throw e;
  }
};

export const incrementDownload = async (id) => {
  try {
    const docRef = doc(db, 'resources', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const currentDownloads = docSnap.data().downloads || 0;
      await updateDoc(docRef, { downloads: currentDownloads + 1 });
    }
  } catch (e) {
    console.error("Firestore incrementDownload error:", e);
  }
};

// 2. SYLLABUS COLLECTION CRUD
export const getSyllabus = async () => {
  try {
    const docRef = doc(db, 'syllabus', 'main_curriculum');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return {};
  } catch (e) {
    console.error("Firestore getSyllabus error:", e);
    return {};
  }
};

export const addSyllabusSubject = async (department, semester, newSubject) => {
  const currentSyllabus = await getSyllabus();
  
  if (!currentSyllabus[department]) {
    currentSyllabus[department] = {};
  }
  if (!currentSyllabus[department][semester]) {
    currentSyllabus[department][semester] = [];
  }

  // Check if subject code already exists
  currentSyllabus[department][semester] = currentSyllabus[department][semester].filter(
    s => s.code !== newSubject.code
  );
  
  currentSyllabus[department][semester].push(newSubject);

  try {
    await setDoc(doc(db, 'syllabus', 'main_curriculum'), currentSyllabus);
    return currentSyllabus;
  } catch (e) {
    console.error("Firestore addSyllabusSubject error:", e);
    throw e;
  }
};

export const deleteSyllabusSubject = async (department, semester, code) => {
  const currentSyllabus = await getSyllabus();
  if (currentSyllabus[department] && currentSyllabus[department][semester]) {
    currentSyllabus[department][semester] = currentSyllabus[department][semester].filter(
      s => s.code !== code
    );
  }

  try {
    await setDoc(doc(db, 'syllabus', 'main_curriculum'), currentSyllabus);
    return currentSyllabus;
  } catch (e) {
    console.error("Firestore deleteSyllabusSubject error:", e);
    throw e;
  }
};

// 3. ASSIGNMENTS COLLECTION CRUD
export const getAssignments = async () => {
  try {
    const snap = await getDocs(collection(db, 'assignments'));
    const list = [];
    snap.forEach(doc => {
      list.push({ id: doc.id, ...doc.data() });
    });
    return list;
  } catch (e) {
    console.error("Firestore getAssignments error:", e);
    return [];
  }
};

export const addAssignment = async (assignmentData) => {
  const newAssignment = {
    ...assignmentData,
    status: 'Pending',
    submittedFile: null,
    submittedDate: null,
    submittedBy: null,
    score: null,
    feedback: null,
    id: `a-${Date.now()}`
  };

  try {
    const docRef = await addDoc(collection(db, 'assignments'), newAssignment);
    return { id: docRef.id, ...newAssignment };
  } catch (e) {
    console.error("Firestore addAssignment error:", e);
    throw e;
  }
};

export const submitAssignment = async (id, submission) => {
  try {
    const docRef = doc(db, 'assignments', id);
    await updateDoc(docRef, {
      status: 'Submitted',
      submittedFile: submission.file,
      submittedDate: new Date().toISOString().split('T')[0],
      submittedBy: submission.studentName,
      submissionNotes: submission.notes || ""
    });
    return true;
  } catch (e) {
    console.error("Firestore submitAssignment error:", e);
    throw e;
  }
};

export const gradeAssignment = async (id, gradeData) => {
  try {
    const docRef = doc(db, 'assignments', id);
    await updateDoc(docRef, {
      score: gradeData.score,
      feedback: gradeData.feedback
    });
    return true;
  } catch (e) {
    console.error("Firestore gradeAssignment error:", e);
    throw e;
  }
};

// 4. USER PROFILE DATA & ROLES SYNC
export const getUsers = async () => {
  try {
    const snap = await getDocs(collection(db, 'users'));
    const list = [];
    snap.forEach(doc => {
      list.push({ uid: doc.id, ...doc.data() });
    });
    return list;
  } catch (e) {
    console.error("Firestore getUsers error:", e);
    return [];
  }
};

export const saveUserProfile = async (uid, userData) => {
  try {
    await setDoc(doc(db, 'users', uid), userData, { merge: true });
    return true;
  } catch (e) {
    console.error("Firestore saveUserProfile error:", e);
    throw e;
  }
};

export const updateUserRole = async (uid, newRole) => {
  try {
    await updateDoc(doc(db, 'users', uid), { role: newRole });
    return true;
  } catch (e) {
    console.error("Firestore updateUserRole error:", e);
    throw e;
  }
};

// Re-export structural options for cascading dropdown forms
export { departments, semesters } from '../data/syllabus';
