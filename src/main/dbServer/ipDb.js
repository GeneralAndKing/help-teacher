import Datastore from 'nedb';
import path from 'path';
/* 
{
    address:102.102.3.1,
    students:[],
}
*/

export default class IpDb {
    constructor() {
        this.db = new Datastore({
            inMemoryOnly: true
        });
    }

}