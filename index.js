const fs = require('fs');
const path = require('path');
const { isNumberObject } = require('util/types');
let parseLevel = 2
class Database {
    constructor(table) {
        this.data = {};
        table = (table.endsWith('.json')) ? table : table + '.json'
        this.filePath = path.join('fhyroxdb', table)
        this.loadData();
    }

   async loadData() {
        try {
              const rawData = fs.readFileSync(this.filePath, 'utf8');
            if (rawData) {
                this.data = JSON.parse(rawData);
            }
        } catch (err) {
            if (err.code !== 'ENOENT') {
                console.error('Database error:', err.message);
            }
        }
    }
    
    async saveData() {
        try {
            const data = JSON.stringify(this.data, null, 2);
           await fs.writeFileSync(this.filePath, data);
        } catch (err) {
            console.error('Database error:', err.message);
        }
    }
    setParseLevel(lvl) {
        parseLevel = lvl
        this.saveData()
    }


    createObject(keys) {
        let currentObj = this.data;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (typeof currentObj[key] !== "object" || currentObj[key] === null) {
                currentObj[key] = {};
            }
            currentObj = currentObj[key];
        }

        return currentObj;
    }

    delete(...keys) {
        this.loadData();
        const obj = this.createObject(keys)
        const key = keys.pop()
        delete obj[key]
        this.saveData()
    }

    set(...keys) {
        this.loadData();
        const value = keys.pop();
        const obj = this.createObject(keys);
        const key = keys[keys.length - 1];
        obj[key] = value;
        this.saveData();
        return obj[key]
    }

    push(...keys) {
        this.loadData();
        const value = keys.pop();
        const obj = this.createObject(keys);
        const key = keys[keys.length - 1];
        if(!Array.isArray(obj[key])) {
            obj[key] = []
        }
        obj[key].push(value)
        this.saveData()
        return obj[key]
    }

    unpush(...keys) {
        this.loadData();
        const value = keys.pop();
        const obj = this.createObject(keys);
        const key = keys[keys.length - 1];
        if(!Array.isArray(obj[key])) {
            obj[key] = []
        } else {
            obj[key].splice(value)
        }
        this.saveData()
        return obj[key]
    }

    deleteAll() {
        this.data = {}
        this.saveData()
    }
    all() {
        return this.loadData()
    }

    type(...keys) {
        this.loadData();
        const obj = this.createObject(keys)
        const value = keys.pop()

        return typeof obj[value]
    }
        
        async add(...keys) {
        this.loadData()
        const value = keys.pop();
        const obj = this.createObject(keys);
        const key = keys[keys.length - 1];
        if (obj.hasOwnProperty(key)) {
            obj[key] += value;
        } else {
            obj[key] = value;
        }
        await this.saveData();
    }

    subtract(...keys) {
        this.loadData()
        const value = keys.pop();
        const obj = this.createObject(keys);
        const key = keys[keys.length - 1];
        if (obj.hasOwnProperty(key)) {
            obj[key] = obj[key] - value;
        } else {
            obj[key] = 0 - value;
        }
        this.saveData();
    }

    get(...keys) {
        this.loadData();
        const key = keys[keys.length - 1];
        const obj = this.createObject(keys);
        return obj[key];
    }

    fetch(...keys) {
        this.loadData();
        const key = keys[keys.length - 1];
        const obj = this.createObject(keys);
        return obj[key];
    }

    has(...keys) {
        this.loadData();
        let currentObj = this.data;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (currentObj[key] !== undefined) {
                currentObj = currentObj[key];
            } else {
                return false;
            }
        }

        return true;
    }
}

function connect(table = "main") {
    return new Database(table);
}

module.exports = { connect };