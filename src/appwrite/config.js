import conf from '../conf/conf'
import { Client, ID, Databases, Storage, Query } from "appwrite"


export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        if (conf.appwriteUrl) {
            try {
                this.client.setEndpoint(conf.appwriteUrl);
            } catch (e) {
                console.warn("Invalid Appwrite URL:", e);
            }
        }
        if (conf.appwriteProjectId) {
            this.client.setProject(conf.appwriteProjectId);
        }
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug, // document id
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId
                }
            )
        } catch (error) {
            console.log("createPost error", error);
        }
    }

    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status
                }
            )
        } catch (error) {
            console.log("updatePost error", error);
        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
            return true;
        } catch (error) {
            console.log("deletePost error", error);
            return false;
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.log("getPost error", error);
            return false;
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            const res = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            );
            return res;
        } catch (error) {
            console.log("getPosts error", error);
            return false;
        }
    }

    uploadFile(file) {
        try {
            return this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("uploadFile error", error);
            return false;
        }
    }

    deleteFile(fileId) {
        try {
            this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true;
        } catch (error) {
            console.log("deleteFile error", error);
            return false;
        }
    }

    getFilePreview(fileId) {
        if (!fileId) return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80";
        if (typeof fileId === 'string' && fileId.startsWith('http')) return fileId;
        try {
            return this.bucket.getFilePreview(
                conf.appwriteBucketId,
                fileId
            );
        } catch (error) {
            console.log("getFilePreview error", error);
            return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80";
        }
    }

}


const service = new Service();

export default service;