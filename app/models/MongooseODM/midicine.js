var mongoose = require('mongoose');

var MedicineSchema = mongoose.Schema({
    code: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true },
    prize: { type: Number, required: true },
    creatAt: { type: Date, default: Date.now }
});

MedicineSchema.pre('save', function (done) {
    done();
})

var Medicine = mongoose.model("Medicine", MedicineSchema);
module.exports = Medicine;