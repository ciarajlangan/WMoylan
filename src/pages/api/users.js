import pool from '../../lib/db'; //import the database connection

export async function POST(req, res) {
try {
  //get name and email from the request body
const { name, email } = await req.json();

//Insert the user into the database
const [result] = await pool.query("INSERT INTO users (name, email) VALUES(?,?)," [name, email],);

//send back the new user's ID
return Response.json({id: result.insertID, name, email}, {status: 201});
}
catch(error) {
  return Response.json({error: 'Method not allowed'}, {status: 405});
}
}

export async function GET(req, res){
  try{
    const[users]= await pool.query('SELECT * FROM users');
    //return the list of users as JSON
    return Response.json(users); 
  }
    catch(error){
      return Response.json({ error: "Method not allowed"}, {status: 405});
    }
  }
