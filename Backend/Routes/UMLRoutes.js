const express = require('express');
const router = express.Router();
const Project = require('../Models/UMLSchema');

// Create a new project
router.post('/UMLData', async (req, res) => {
    try {
        const { UMLData, projectName, managerId } = req.body;

        if (!projectName || !UMLData || !managerId) {
            return res.status(400).json({
                errors: [
                    !projectName && 'Project name is required.',
                    !UMLData && 'UML Data is required.',
                    !managerId && 'Manager Id is required.'
                ].filter(Boolean)
            });
        }

        const NewUMLData = new Project({ UMLData, projectName, managerId });
        await NewUMLData.save();

        res.status(201).json({
            message: 'UML Data stored successfully',
            project: NewUMLData
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/AllUMLData/:managerId', async (req, res) => {
    const { managerId } = req.params;

    try {
        const UML = await Project.find({ managerId });

        if (!UML) {
            return res.status(404).send({ message: 'UML Data not found' });
        }

        // Return UML details including assigned manager
        res.status(200).send(UML);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});
module.exports = router;