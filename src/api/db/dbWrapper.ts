// Reference: https://www.npmjs.com/package/mysql2

import { OkPacket, ProcedureCallPacket, QueryError, ResultSetHeader, RowDataPacket, createPool } from 'mysql2';
import { Service } from 'typedi';

@Service()
export class DbWrapper {
    private pool = createPool({
        user: "ericsgearguest",
        host: "localhost",
        database: "ericsgear",
        password: "N0ne1N0ne1!",
        port: 3306
    });

    query(queryString: string, queryValues: object, cbFunc: (arg0: { error: any; results: any; }) => void) {
        let parameterizedQuery = this.queryFormat(queryString, queryValues);

        this.pool.query(parameterizedQuery, (error, results) => {
            if (cbFunc) {
                cbFunc(this.setResponse(error, results));
            }
        });
    }

    private queryFormat(query: string, values: object) {
        if (!values) {
            return query;
        }
        
        return query.replace(/\:(\w+)/g, (txt: string, key: string) => {
            if (values.hasOwnProperty(key)) {
                return encodeURI(values[key as keyof typeof values]).replace(/%20/g,  " ").replace(/%3A/g, ":");
            }
            
            return txt;
        });
    }

    healthCheck() {
        this.pool.getConnection((error, connection) => {
            connection.ping((err) => {
                if (err) throw err;

                console.log('Server responded to ping');
            });
        });
    }

    private setResponse(error: QueryError | null, results: OkPacket | RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | OkPacket[] | ProcedureCallPacket) {
        return {
            error: error,
            results: results ? results : null,
        };
    }
}
