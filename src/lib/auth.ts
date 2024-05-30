import { auth, db } from '$services/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, query, where, collection, getDocs } from 'firebase/firestore';

export const registerUser = async (
	email: string,
	password: string,
	username: string,
	role: string
) => {
	const userCredential = await createUserWithEmailAndPassword(auth, email, password);
	const user = userCredential.user;

	await setDoc(doc(db, 'users', user.uid), {
		username,
		role,
		email: user.email
	});

	return user;
};

export const loginUser = async (username: string, password: string) => {
	const usersRef = collection(db, 'users');
	const q = query(usersRef, where('username', '==', username));
	const querySnapshot = await getDocs(q);
	if (querySnapshot.empty) {
		throw new Error('User does not exist');
	}
	const userDoc = querySnapshot.docs[0];
	const email = userDoc.data().email;

	return signInWithEmailAndPassword(auth, email, password);
};
