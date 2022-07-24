import mongoose from 'mongoose';

const dbConnection = () => {
        mongoose.connect(process.env.DB_URI).then((conn) => {
                console.log(`Connected to db: ${conn.connection.host}`);
        }
        )
        // .catch((err) => {
        //         console.log(`Error connecting to db: ${err}`);
        //         process.exit(1);
        // }
        // );
}

export default dbConnection;