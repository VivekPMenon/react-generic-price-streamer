export interface File {
    filename?: string;
    size?: number;
    uploaded?: Date;
    content?: string;
    native_file: any;
}