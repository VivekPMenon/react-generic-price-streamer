export interface UserRoleData {
    id: number;
    userRole: UserRole;
    emails: string[];
  };

  export enum UserRole {
    CENTER_IBIS = "Center IBIS",
    HUNTER = "HUNTER",
    ADMIN = "Admin",
    OPERATIONS = "Operations",
  };

export const userRoleData: UserRoleData[] = [
  {
    id: 1,
    userRole: UserRole.CENTER_IBIS,
    emails: ["awolfberg@hurricanecap.com"],
  },
  {
    id: 2,
    userRole: UserRole.HUNTER,
    emails: ["tsandoz@hurricanecap.com", "jweekes@hurricanecap.com"],
  },
  {
    id: 3,
    userRole: UserRole.ADMIN,
    emails: [
      "cnapoli@hurricanecap.com",
      "pquaranta@hurricanecap.com",
      "atobias@hurricanecap.com",
      "dkienzle@hurricanecap.com",
    ],
  },
  {
    id: 4,
    userRole: UserRole.OPERATIONS,
    emails: [
      "dkim@hurricanecap.com",
      "mramasubbiah@hurricanecap.com",
      "rbergman@hurricanecap.com",
      "akrishna@hurricanecap.com",
      "abalasubramanian@hurricanecap.com",
      "vmenon@hurricanecap.com",
      "razam@hurricanecap.com",
      "GowdhamV@hurricanecap.com"
    ],
  },
];

export function getRoleByEmail(email: string): UserRole {
    const role = userRoleData.find((role) => role.emails.includes(email));
    return role ? role.userRole : UserRole.OPERATIONS;
};