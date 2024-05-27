import { createSlice } from "@reduxjs/toolkit";

import { v4 as uuid } from "uuid";

const gruposSlice = createSlice({
  name: "grupos",
  initialState: {
    groups: {},
  },
  reducers: {
    createGroup: (state, action) => {
      state.groups[action.payload.nombre] = action.payload;
    },
    setGruposInicial: (state, action) => {
      let grupos = {};
      if (action.payload.length > 0) {
        action.payload.forEach((grupo) => {
          let nombre = grupo.nombre;
          let idLocal = grupo.id;
          grupos[nombre] = {
            idLocal: idLocal,
            nombre: nombre,
            members: [],
          };
        });
        state.groups = grupos;
      }
    },
    deleteGroup: (state, action) => {
      const nombre = action.payload;
      delete state.groups[nombre];
    },
    createMember: (state, action) => {
      let { grupos, id } = action.payload;

      grupos.forEach((grupo) => {
        if (state.groups.hasOwnProperty(grupo)) {
          const nuevoMiembro = {
            idGrupo: state.groups[grupo].idLocal,
            correo: action.payload.correo,
            id,
          };

          const updatedMembers = [...state.groups[grupo].members, nuevoMiembro];

          state.groups = {
            ...state.groups,
            [grupo]: {
              ...state.groups[grupo],
              members: updatedMembers,
            },
          };
        }
      });
    },
    setMiembrosInicial: (state, action) => {
      if (action.payload.length > 0) {
        action.payload.forEach((correo) => {
          Object.values(state.groups).forEach((grupo) => {
            if (grupo.idLocal === correo.idGrupo) {
              grupo.members = [...grupo.members, correo];
            }
          });
        });
      }
    },
    deleteMember: (state, action) => {
      console.log(state.groups);
      console.log(action.payload);
      let grupo = action.payload.grupoSeleccionado;
      const filteredMembers = state.groups[grupo].members.filter(
        (miembro) =>
          JSON.stringify(miembro.id) !==
          JSON.stringify(action.payload.miembro.id)
      );
      state.groups[grupo].members = filteredMembers;
    },
  },
});

export const {
  createGroup,
  setGruposInicial,
  deleteGroup,
  createMember,
  setMiembrosInicial,
  deleteMember,
} = gruposSlice.actions;
export default gruposSlice.reducer;
