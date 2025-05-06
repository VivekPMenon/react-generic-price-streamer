import { webApihandler } from "../web-api-handler";

class UserService {
    private serviceName = 'hurricane-api-2-0';

   async getUserList(): Promise<any> {
      const results = await webApihandler.get('user/list-users',{}, { serviceName: this.serviceName });
      return results;
    }

    // To save the user role
    savePreviewUserRoleId(role: string) {
        sessionStorage.setItem('previewId', role);
    }

    // To retrieve the user role
    getPreviewUserRoleId() {
        return sessionStorage.getItem('previewId');
    }
  
  
}

export const userService = new UserService();