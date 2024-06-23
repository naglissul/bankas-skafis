import { auth, db } from '$services/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

interface User {
	uid: string;
	email: string;
	username: string;
	role: string;
}

const currentUser: Writable<User | null> = writable(null);
const idToken: Writable<string | null> = writable(null);

onAuthStateChanged(auth, async (firebaseUser) => {
	if (firebaseUser) {
		const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
		if (userDoc.exists()) {
			const userData = userDoc.data() as User;
			currentUser.set({
				uid: firebaseUser.uid,
				email: firebaseUser.email!,
				username: userData.username,
				role: userData.role
			});
		}
		idToken.set(await firebaseUser.getIdToken());
	} else {
		currentUser.set(null);
		idToken.set(null);
	}
});

export { currentUser, idToken };
export type { User };
