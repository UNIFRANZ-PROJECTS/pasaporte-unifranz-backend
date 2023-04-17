const mongoose = require('mongoose');

const { TypeUserSchema, RoleSchema, PermisionSchema, UsuarioSchema, CategoriaSchema, } = require('../models');
const ObjectId = mongoose.Types.ObjectId;

const typeUserExists = async (name = "", data = "") => {
  // Verificar si el tipo de usuario existe
  const objIdToExclude = new ObjectId(data.req.params.id);

  let existTypeUser = await TypeUserSchema.findOne({
    name: name,
    _id: { $ne: objIdToExclude ?? null },
    state: true
  });

  if (existTypeUser) {
    throw new Error(`El nombre: ${name}, ya está registrado`);
  }
};

const rolExists = async (name = "", data = "") => {
  // Verificar si el tipo de usuario existe
  const objIdToExclude = new ObjectId(data.req.params.id);

  let existRol = await RoleSchema.findOne({
    name: name,
    _id: { $ne: objIdToExclude ?? null },
    state: true
  });

  if (existRol) {
    throw new Error(`El nombre: ${name}, ya está registrado`);
  }
};

const permisionExists = async (name = "", data = "") => {
  // Verificar si el tipo de usuario existe
  const objIdToExclude = new ObjectId(data.req.params.id);

  let existRol = await PermisionSchema.findOne({
    name: name,
    _id: { $ne: objIdToExclude ?? null },
    state: true
  });

  if (existRol) {
    throw new Error(`El nombre: ${name}, ya está registrado`);
  }
};
const emailExists = async (email = "", data = "") => {
  // Verificar si el tipo de usuario existe
  const objIdToExclude = new ObjectId(data.req.params.id);

  let existRol = await UsuarioSchema.findOne({
    email: email,
    _id: { $ne: objIdToExclude ?? null },
    state: true
  });

  if (existRol) {
    throw new Error(`El nombre: ${email}, ya está registrado`);
  }
};
const categoryExists = async (title = "", data = "") => {
  // Verificar si el tipo de usuario existe
  const objIdToExclude = new ObjectId(data.req.params.id);

  let existCategory = await CategoriaSchema.findOne({
    title: title,
    _id: { $ne: objIdToExclude ?? null },
    state: true
  });

  if (existCategory) {
    throw new Error(`El titulo: ${title}, ya está registrado`);
  }
};

module.exports = {
  typeUserExists,
  rolExists,
  permisionExists,
  emailExists,
  categoryExists,
};
