const express = require('express');
const router = express.Router();
const fetchuser = require('../middelware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

// // router.get('./',(req,res)=>{
// //     res.json([])
// // })

//  ROUTE 1 : Get all the notes using: GET "/api/notes/getuser". login required

router.get('/fetchallnotes', fetchuser, async (req, res) => {//fetchuser is middlewre
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})


// ROUTE 2 : Add a new Note using:POST"/api/notes/addnote .Login req
//creating cutom create user path
router.post('/addnote', fetchuser, [
    body('title', 'Enter valid title minum 3 characters').isLength({ min: 3 }),
    body('description', 'Decription must be 5 characters minimum').isLength({ min: 5 }), //.isStrongPassword(),

], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        //If there any error , return bad request and th error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });

        }

        const note = new Note({
            title, description, tag, user: req.user.id // get the t,d,t from that id
        })
        const saveNote = await note.save()
        res.json(saveNote) //saving in db
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

    //check wherther the iuser with same email exisy oor not

})

//  ROUTE 3 : Updating an existing notes using PUT "/api/notes/updatenotes". login required

router.put('/updatenote/:id', fetchuser, async (req, res) => {//fetchuser is middlewre
    const { title, description, tag } = req.body; // Destructring
    try {
        //Create a newNote Object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //FInd the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})



//  ROUTE 4 : Deleting an existing notes using DELETE "/api/notes/deletenote". login required

router.delete('/deletenote/:id', fetchuser, async (req, res) => {//fetchuser is middlewre
    try {
        //FInd the note to be delete and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        //LAllowing deteltion only if user own this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndDelete(req.params.id) //Delete the particular note by using id
        res.json({ "Sucess": "Note has been delete", note: note });

        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})



module.exports = router



