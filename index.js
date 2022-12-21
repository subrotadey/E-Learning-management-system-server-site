const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// username: dbuser1
// password: 5m9NTUTXhchtjSg2

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hs9qs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const teacherCollection = client.db("edulogy").collection("user");
    const courseCollection = client.db("edulogy").collection("course");
    const enrollmentCollection = client.db("edulogy").collection("enrollment");
    const studentCollection = client.db('edulogy').collection('student');
    const reviewsCollection = client.db('edulogy').collection('reviews');

    /*
    const enrollmentCollection = client.db('edulogy').collection('enrollment');
    const studentCollection = client.db('edulogy').collection('student');

*/
    app.put('/student/:email', async(req, res) => {
      const email = req.params.email;
      const student = req.body;
      const filter = {email: email};
      const options = { upsert: true };
      const updateDoc = {
        $set: student,
      };
      const result = await studentCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })


    /**
     * API Naming Convention
     * app.get('/booking)
     */

    //All user data for admin
    // app.get("/enrollment", async (req, res) => {
    //   const query = {};
    //   // const query = { email: email };
    //   const cursor = enrollmentCollection.find(query);
    //   const enrollments = await cursor.toArray();
    //   res.send(enrollments);
    // });


    app.get("/enrollment", async (req, res) => {
      const student = req.query.student;
      const query = {student: student} 
      const enrollments = await enrollmentCollection.find(query).toArray();
      res.send(enrollments);
    });

    app.get('/enrollment/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const enrollments = await enrollmentCollection.findOne(query);
      res.send(enrollments);
    })


    app.post("/enrollment", async (req, res) => {
      const enrollment = req.body;
      const query = {}
      const result = await enrollmentCollection.insertOne(enrollment);
      res.send({ success: true, result });
    });


    //app get teachers
    app.get("/teacher", async (req, res) => {
      const query = {};
      const cursor = teacherCollection.find(query);
      const teachers = await cursor.toArray();
      res.send(teachers);
    });

    app.get("/teacher/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await teacherCollection.findOne(query);
      res.send(result);
    });

    //add a teacher
    app.post("/teacher", async (req, res) => {
      const newTeacher = req.body;
      console.log("adding new teacher", newTeacher);
      const result = await teacherCollection.insertOne(newTeacher);
      res.json(result);
    });

    //update teacher
    app.put("/teacher/:id", async (req, res) => {
      const id = req.params.id;
      const updatedTeacher = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          first_name: updatedTeacher.first_name,
          last_name: updatedTeacher.last_name,
          img_link: updatedTeacher.img_link,
          email: updatedTeacher.email,
          designation: updatedTeacher.designation,
          description: updatedTeacher.description,
        },
      };
      const result = await teacherCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    //delete a teacher user
    app.delete("/teacher/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await teacherCollection.deleteOne(query);
      res.json(result);
    });

    /////////////////////////////////////////////////////////////////////////////
    // Course
    //----------------------------------------------------------------------------
    //all course get
    app.get("/course", async (req, res) => {
      const query = {};
      const cursor = courseCollection.find(query);
      const courses = await cursor.toArray();
      res.json(courses);
    });

    app.get("/course/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await courseCollection.findOne(query);
      res.json(result);
    });

    //add a Course
    app.post("/course", async (req, res) => {
      const newCourse = req.body;
      // console.log('adding a new course', newCourse);
      const result = await courseCollection.insertOne(newCourse);
      res.json(result);
    });

    //delete a course
    app.delete("/course/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await courseCollection.deleteOne(query);
      res.json(result);
    });



    // store review 
    app.post('/review', async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review)
      res.json(result)
  })

  // get all reviews
  app.get('/reviews', async (req, res) => {
      const result = await reviewsCollection.find({}).toArray()
      res.json(result)
  })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running my Node CRUD Server");
});

app.listen(port, () => {
  console.log("Listening to Port", port);
});
