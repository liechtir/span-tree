import produce from "immer";
import dotProp from "dot-prop-immutable";

import { FETCH_TREE, OPEN_DIR, CLOSE_DIR, UPDATE_TREE } from "../../types/API";

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TREE:
      return {
        ...state,
        [action.reducerDetails.repoName]: {
          ...state[action.reducerDetails.repoName],
          [action.reducerDetails.branchName]: action.payload
            .map((node) => {
              return {
                name: node.name,
                path: node.path
                  .split("/")
                  .filter((pathSub) => pathSub.length !== 0),
                isTree:
                  node.type === "tree"
                    ? {
                        isOpen: false,
                      }
                    : false,
                children: node.type === "tree" ? {} : undefined,
              };
            })
            .reduce((map, obj) => {
              map[obj.name] = obj;
              return map;
            }, {}),
        },
      };
    case OPEN_DIR:
      let objectPath = [
        action.reducerDetails.repoName,
        action.reducerDetails.branchName,
      ];
      for (let i = 0; i < action.payload.length; i++) {
        objectPath.push(action.payload[i]);
        if (i !== action.payload.length - 1) {
          objectPath.push("children");
        }
      }
      objectPath = [...objectPath, "isTree", "isOpen"];
      let propName = objectPath.pop();

      let nextState = produce(state, (draft) => {
        draft = objectPath.reduce((it, prop) => it[prop], draft);
        draft[propName] = true;
      });
      return nextState;
    case UPDATE_TREE:
      objectPath = `${action.reducerDetails.repoName}.${action.reducerDetails.branchName}.`;
      objectPath += action.reducerDetails.path.join(".children.");
      objectPath += ".children";
      const children = action.payload
        .map((node) => {
          return {
            name: node.name,
            path: node.path
              .split("/")
              .filter((pathSub) => pathSub.length !== 0),
            isTree:
              node.type === "tree"
                ? {
                    isOpen: false,
                  }
                : false,
            children: node.type === "tree" ? {} : undefined,
          };
        })
        .reduce((map, obj) => {
          map[obj.name] = obj;
          return map;
        }, {});
      return dotProp.set(state, objectPath, children);
    case CLOSE_DIR:
      objectPath = [
        action.reducerDetails.repoName,
        action.reducerDetails.branchName,
      ];
      for (let i = 0; i < action.payload.length; i++) {
        objectPath.push(action.payload[i]);
        if (i !== action.payload.length - 1) {
          objectPath.push("children");
        }
      }
      // objectPath = [...objectPath, "isTree", "isOpen"];
      propName = objectPath.pop();

      nextState = produce(state, (draft) => {
        draft = objectPath.reduce((it, prop) => it[prop], draft);
        draft[propName]["isTree"]["isOpen"] = false;
        draft[propName]["children"] = {};
      });
      return nextState;

    default:
      return state;
  }
};
