const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		unique: true,
	},
	slug: {
		type: String,
		unique: true,
		sparse: true,
	},
	description: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	price: { 
		type: Number,
		required: true,
	},
	inStock: {
		type: Boolean,
		default: true,
	},
	categories: { type: Array },
	size: { type: Array },
	color: { type: Array },
}, 
	{timestamps: true}
)

// Middleware để auto-generate slug từ title
ProductSchema.pre("save", function(next) {
	if (this.isModified("title")) {
		this.slug = this.title
			.toLowerCase()
			.trim()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^\w\s-]/g, "")
			.replace(/[\s_]+/g, "-")
			.replace(/^-+|-+$/g, "");
	}
	next();
})

ProductSchema.pre("findByIdAndUpdate", function(next) {
	const update = this.getUpdate();
	if (update.title) {
		update.slug = update.title
			.toLowerCase()
			.trim()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^\w\s-]/g, "")
			.replace(/[\s_]+/g, "-")
			.replace(/^-+|-+$/g, "");
	}
	next();
})

module.exports = mongoose.model("Product", ProductSchema)