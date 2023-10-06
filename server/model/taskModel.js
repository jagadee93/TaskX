const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskListSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        default: "Work List"
    },
    category: {
        type: String,
        required: false,
        trim: true,
        default: "Work"
    },
    tasks: [
        {
            _id: {
                type: mongoose.SchemaTypes.ObjectId,
                default: () => new mongoose.mongo.ObjectId(),

            },
            description: {
                type: String,
                required: true,
                trim: true,
            },
            due_date: {
                type: Date,
                default: () => new Date(Date.now() + 24 * 60 * 1000),
                required: false,
            },
            completed: {
                type: Boolean,
                default: false,
            }

        }
    ],
    createdBy: {
        user_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        }
    }

});

module.exports = mongoose.model('TaskList', taskListSchema);

