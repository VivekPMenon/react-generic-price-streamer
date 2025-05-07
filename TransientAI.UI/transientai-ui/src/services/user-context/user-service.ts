import { webApihandler } from "../web-api-handler";
import { UserInfo } from "./model";

class UserService {
    private serviceName = 'hurricane-api-2-0';

   async getUserList(): Promise<any> {
      const results = await webApihandler.get('user/list-users/',{}, { serviceName: this.serviceName });
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

    getPreviewUserRole() {
        return sessionStorage.getItem('previewUserRole');
    }

    savePreviewUserRole(role: string) {
        sessionStorage.setItem('previewUserRole', role);
    }

    // checkCurrentRole() {
    //     const previewRole = sessionStorage.getItem('previewUserRole');
    //     const getUserInfo = sessionStorage.getItem("userInfo");
    //     const existingUserInfo = getUserInfo && JSON.parse(getUserInfo);
    //     return (!previewRole ? existingUserInfo?.role : previewRole);
    // }
}

export const userService = new UserService();