
import { collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { DocumentReference } from 'firebase/firestore';

// add user to collection
export const addUser = async (user, username) => {
    // access users collection
    const usersCollection = collection(db, 'users');

    // add user to collection with user.id as document id
    await setDoc(doc(usersCollection, user.uid), {
        email: user.email, // set email
        username: username, // set username
        displayName: user.displayName, // set display name
        createdAt: new Date(), // set current date
        profileImageUrl: null, // set default profile image
        groups: [], // reference to groups user is in
        friends: [], // reference to friends user has
        friendRequests: [], // friend requests user has
        notifications: [], // notifications user has
        groupInvites: [], // group invites user has
        settings: { // user settings
            notifications: true, // notifications setting
            emailNotifications: true, // email notifications setting
        },
        credits: 0, // user credits
        pledges: {0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false}, // representing days of the week user has made a pledge to check in
        logs: [], // reference to logs of user check ins
        online: true, // user online status
        lastOnline: new Date(), // user last online
    });

    // return user
    return user;
}

export const createGroup = async (user, groupName, habit, frequency) => {

    const db = getFirestore();
    const groupRef = collection(db, 'groups');
    if (!user?.uid) {
        console.error('User UID is undefined');
        return;
    }
    const userRef = doc(db, 'users', user.uid);
    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const groupDoc = {
        users: [user?.uid],
        // get name from user input or user display to make a group
        name: groupName,
        // set user reference as admin
        admin: userRef,
        habit: habit,
        frequency: frequency,
        garden: null,
        streak: 0,
        // generate random phrase for join code
        joinCode: joinCode,
    };
    const newUserGroup = await addDoc(groupRef, groupDoc);
    const userDoc = {
        groups: [...groups, newUserGroup]
    };
    await updateDoc(userRef, userDoc);
    return newUserGroup;
}