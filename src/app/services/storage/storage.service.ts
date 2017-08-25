import {Injectable} from '@angular/core';

@Injectable()
export class StorageService {

    constructor() {
    }

    getSync(key: string): Promise<any> {
        return JSON.parse(localStorage.getItem(key));
    }

    get(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(JSON.parse(localStorage.getItem(key)));
        });
    }

    set(key: string, value: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            localStorage.setItem(key, JSON.stringify(value));
            resolve(true);
        });
    }

    remove(key: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            localStorage.removeItem(key);
            resolve(true);
        });
    }

    isEmpty(key: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            return this.get(key).then((data => {
                resolve(data === null);
            }));
        })
    }
}
