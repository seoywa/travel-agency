import { ID, OAuthProvider, Query } from "appwrite"
import { account, appwriteConfig, database } from "./client"
import { redirect } from "react-router"

export const loginWithGoogle = async () => {
  try {
    account.createOAuth2Session(
      OAuthProvider.Google
    )

  } catch(error) {
    console.log('loginWithGoogle', error)
  }
}

export const getUser = async () => {
  try {
    const user = await account.get();

    if (!user) return redirect('/sign-in');

    const { documents } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.equal('accountId', user.$id),
        Query.select(['name', 'email', 'imageUrl', 'joinedAt', 'accountId'])
      ]
    )

  } catch(error) {
    console.log(error)
  }
}

export const logoutUser = async () => {
  try {
    await account.deleteSession('current');

  } catch(error) {
    console.log('LogoutUser error', error);
  }
}

export const getGooglePicture = async () => {
  try {
    const session = await account.getSession('current');

    const oAuthToken = session.providerAccessToken;

    if (!oAuthToken) {
      console.log('No OAuth token available');
      return null;
    }

    const response = await fetch(
      "https://people.googleapis.com/v1/people/me?personFields=photos",
      { headers: { Authorization: `Bearer ${oAuthToken}`}}
    )

    if (!response.ok) {
      console.log('Failed to fetch profile photo from Google People API');
      return null;
    }
    
    const data = await response.json();
    const photoUrl = data.photos && data.photos.length > 0
      ? data.photos[0].url
      : null;

    return photoUrl;

  } catch(error) {
    console.log('GetGooglePicture error', error)
  }
}

// ADRIAN'S CODE
// const getGooglePicture = async (accessToken: string) => {
//   try {
//     const response = await fetch(
//       "https://people.googleapis.com/v1/people/me?personFields=photos",
//       { headers: { Authorization: `Bearer ${accessToken}`}}
//     );

//     if (!response.ok) throw new Error('Failed to fetch Google profile photo');

//     const { photo } = await response.json();
//     return photo?.[0]?.url || null;
    
//   } catch (e) {
//     console.log("Error fetching google photo: ", e);
//     return null;
//   }
// }

export const storeUserData = async () => {
  try {
    const user = await account.get();

    if (!user) return null;

    //Check if user already exist in the db, if yes simply return the documents in the db
    const { documents } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', user.$id)]
    );

    if (documents.length > 0) return documents[0];
    
    //Else we get profile pic from google, then create an entire new user document
    const imageUrl = await getGooglePicture();

    const newUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: user.$id,
        email: user.email,
        name: user.name,
        imageUrl: imageUrl,
        joinedAt: new Date().toISOString()
      }
    );

    if (!newUser.$id) redirect('/sign-in');

  } catch(error) {
    console.log(error)
  }
}

export const getAllUsers = async (limit: number, offset: number) => {
  try {
    const { documents: users, total } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.limit(limit), Query.offset(offset)]
    )

    if (total === 0) return { users: [], total };

    return { users, total }

  } catch(error) {
    console.log(error)
  }
}

export const getExistingUser = async (id: string) => {
  try {
    const { documents, total } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', id)]
    );

    return total > 0 ? documents[0] : null;

  } catch (error) {
    console.log('Error fetching existing user: ', error)
  }
}