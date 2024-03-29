import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

import { IVendor, IVendorModel } from "./types/vendor-type"

mongoose.set("strictQuery", true)

const vendorSchema = new mongoose.Schema<IVendor, IVendorModel>(
  {
    type: {
      type: String,
      default: "vendor",
    },
    socketId: {
      type: String,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    profilePic: {
      type: String,
      default: null,
    },
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      // validate: {
      //   validator: async function (value: string) {
      //     const vendor = await Vendor.findOne({ email: value });
      //     if (vendor) {
      //       throw new Error('Email already exists');
      //     }
      //   },
      //   message: 'Email already exists',
      // },
    },
    contact: {
      type: Number,
      // validate(value) {
      //   if (!value.length === 10) {
      //     throw new Error('Enter a valid contact number');
      //   }
      // },
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    address: {
      type: String,
      trim: true,
      default: null,
    },
    biography: {
      type: String,
      trim: true,
      default: null,
    },
    workHistory: [
      {
        title: String,
        company: String,
        location: String,
        from: String,
        to: String,
      },
    ],
    lookingFor: [
      {
        title: String,
        location: String,
      },
    ],
    ownShot: [mongoose.Schema.Types.ObjectId],
    likedShot: [mongoose.Schema.Types.ObjectId],
    shotCollections: [mongoose.Schema.Types.ObjectId],
    socialLinks: [
      {
        platform: String,
        url: String,
      },
    ],
    skills: [String],
    follower: [String],
    following: [String],
    resetToken: String,
    expireToken: Date,
    otp: {
      type: String,
      default: null,
    },
    otpExpireIn: {
      type: Date,
      expireAfterSeconds: 150,
      default: null,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

vendorSchema.virtual("Shot", {
  ref: "shotModel",
  localField: "_id",
  foreignField: "owner",
})

vendorSchema.methods.toJSON = function () {
  const vendor = this
  const vendorObject = vendor.toObject()

  delete vendorObject.password
  delete vendorObject.tokens
  delete vendorObject.otp
  return vendorObject
}

vendorSchema.methods.generateAuthToken = async function () {
  const vendor = this
  const JWT_SECRET = process.env.JWT_SECRET || null
  if (!JWT_SECRET) {
    throw new Error("JWT secret not found")
  }
  const token = jwt.sign({ _id: vendor._id.toString() }, JWT_SECRET, {
    expiresIn: "1h",
  })
  vendor.tokens = vendor.tokens.concat({ token })
  await vendor.save()
  return token
}

vendorSchema.statics.findByCredentials = async (email, password) => {
  const vendor = await Vendor.findOne({
    email,
  })
  if (!vendor) {
    throw new Error("Invalid vendor name or Sign up first !!")
  }
  const isMatch = await bcrypt.compare(password, vendor.password)
  if (!isMatch) {
    throw new Error("Invalid Password!")
  }
  return vendor
}

vendorSchema.pre("save", async function (next) {
  const vendor = this
  if (vendor.isModified("password")) {
    vendor.password = await bcrypt.hash(vendor.password, 8)
  }
  next()
})

const Vendor: IVendorModel = (mongoose.models.Vendor as IVendorModel) || mongoose.model<IVendor, IVendorModel>("Vendor", vendorSchema)

export default Vendor
