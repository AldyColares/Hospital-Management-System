var mongoose = require('mongoose');

var MediceneSchema = mongoose.Schema({
    code: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true },
    prize: { type: Number, required: true },
    creatAt: { type: Date, default: Date.now }
});

MediceneSchema.pre('save', function (done) {
    done();
})

var Medicene = mongoose.model("Medicene", MediceSchema);
module.exports = Medicene;