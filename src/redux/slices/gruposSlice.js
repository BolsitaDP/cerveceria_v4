import { createSlice } from "@reduxjs/toolkit";

import { v4 as uuid } from "uuid";
// import postCrearGrupos from "../../requests/postCrearGrupos";
// import postEliminarGrupo from "../../requests/postEliminarGrupo";
// import postCrearCorreos from "../../requests/postCrearCorreos";
// import postEliminarCorreo from "../../requests/postEliminarCorreo";

const gruposSlice = createSlice({
  name: "grupos",
  initialState: {
    groups: {},
  },
  reducers: {
    createGroup: (state, action) => {
      // let groupsValues = Object.values(state.groups);
      // let lastId = groupsValues[groupsValues.length - 1].id;

      // const nuevoGrupo = {
      //   idLocal: uuid(),
      //   nombre: action.payload.nombre,
      //   members: [],
      //   // Falta id, que es secuencial y se usa para borrar el grupo
      // };

      state.groups[action.payload.nombre] = action.payload;

      // postCrearGrupos(nuevoGrupo);
    },
    setGruposInicial: (state, action) => {
      let grupos = {};
      if (action.payload.length > 0) {
        action.payload.data.forEach((grupo) => {
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
      console.log(action.payload);
      const [nombre] = action.payload;
      delete state.groups[nombre];
      let idLocal = action.payload[1].idLocal;
      // postEliminarGrupo({ nombre, idLocal });
    },
    createMember: (state, action) => {
      let grupos = action.payload.grupos;

      grupos.forEach((grupo) => {
        if (state.groups.hasOwnProperty(grupo)) {
          let id = uuid();
          const nuevoMiembro = {
            idGrupo: state.groups[grupo].idLocal,
            correo: action.payload.correo,
            id: id,
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

      // let groupId = state.groups[grupo].idLocal;
      // let correo = action.payload.correo;
      // let id = action.payload.idLocal;
      // Falta id, que es secuencial y se usa para borrar el miembro

      // postCrearCorreos({ groupId, correo, id });
    },
    setMiembrosInicial: (state, action) => {
      if (action.payload.length > 0) {
        action.payload.data.forEach((correo) => {
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
      let grupo = action.payload.grupoSeleccionado;
      const filteredMembers = state.groups[grupo].members.filter(
        (miembro) =>
          JSON.stringify(miembro.id) !==
          JSON.stringify(action.payload.miembro.id)
      );
      state.groups[grupo].members = filteredMembers;

      let miembro = action.payload.miembro;
      // postEliminarCorreo(miembro);
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
