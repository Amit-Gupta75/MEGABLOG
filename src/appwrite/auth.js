import conf from '../conf/conf'
import { Client, Account, ID } from "appwrite"


export class AuthService {
    client = new Client();
    account;

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
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            );

            if (userAccount) {
                // call another method
                return this.login({ email, password });
            } else {
                return userAccount;
            }

        } catch (error) {
            console.log("Appwrite createAccount error", error);
            throw error;
        }
    }

    async login({ email, password }) {
        return await this.account.createEmailPasswordSession(
            email,
            password
        );
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch {
            return null;
        }
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("appwrite service: logout", error);
        }
    }
}


const authService = new AuthService();

export default authService;