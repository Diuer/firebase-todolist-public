import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import i18next from "i18next";
import {
  Ref,
  List,
  Label,
  Container,
  Header,
  Button,
  Icon,
  Popup,
} from "semantic-ui-react";
import { toast } from "react-semantic-toasts";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import {
  getTodoList,
  deleteTodoItem,
  updateTodoItem,
  updateTodoList,
} from "../../utils/firebase";
import { login, logout } from "../../utils/firebase";
import {
  OPTIONS_CATEGORY,
  TODO_STATUS,
  PRIORITY_COLOR,
} from "../../constants/enum";

import useLocales from "../../locales/useLocales";

import { TodoForm } from "../../sections/form";

import Tooltip from "../../components/Tooltip";

import "./TodoList.scss";

const TOAST_LOGIN = {
  type: "warning",
  icon: "bomb",
  title: i18next.t("alert.no.permission"),
  description: i18next.t("alert.please.login"),
  animation: "bounce",
  time: 3000,
  onClose: login,
};

export const TodoList = ({ isLogged }) => {
  const { translate } = useLocales();

  const [list, setList] = useState([]);
  const [detailModal, setDetailModal] = useState({
    open: false,
    isEdit: false,
    data: null,
  });

  const handleDrop = (item, { from, to }) => {
    if (from !== to) {
      const newList = [...list];
      const [moveTarget] = newList.splice(from, 1);
      newList.splice(to, 0, moveTarget);

      setList(newList);

      item.index = to;
      item.startClientOffset = null;

      updateTodoList(newList);
    }
  };

  const handleEdit = (item) => {
    setDetailModal({
      open: true,
      isEdit: true,
      data: item,
    });
  };

  const handleDelete = async (id) => {
    await deleteTodoItem(id);
    getList();
  };

  const handleCompleted = async (item) => {
    await updateTodoItem(item.id, {
      ...item,
      isCompleted: !item.isCompleted,
    });
    getList();
  };

  const getList = async () => {
    if (isLogged) {
      const resp = await getTodoList();
      setList(resp);
      return resp;
    } else {
      setList([]);
    }
  };

  useEffect(() => {
    getList();
  }, [isLogged]);

  const handleCloseModal = useCallback(() => {
    setDetailModal({ open: false, isEdit: false, data: null });
  }, []);

  return (
    <>
      {detailModal.open && (
        <TodoForm
          {...detailModal}
          onClose={handleCloseModal}
          onSubmit={() => {
            getList();
            handleCloseModal();
          }}
        />
      )}
      <Container className="container-todolist" text>
        <div className="list-header">
          <Button
            floated="right"
            onClick={() => {
              if (isLogged) {
                setDetailModal({ open: true, isEdit: false, data: null });
              } else {
                toast(TOAST_LOGIN);
              }
            }}
            primary
          >
            {translate("button.create")}
          </Button>
          <Header
            className="page-title"
            content="Todo List"
            textAlign="center"
            as="h1"
          />
        </div>
        <DndProvider backend={HTML5Backend}>
          <List>
            {list.map((item, index) => (
              <List.Item
                key={item.createTimestamp.seconds}
                content={
                  <TodoItem
                    index={index}
                    item={item}
                    onDrop={handleDrop}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onCompleted={handleCompleted}
                  />
                }
              ></List.Item>
            ))}
          </List>
        </DndProvider>
      </Container>
    </>
  );
};

const TodoItem = ({ item, index, onDrop, onEdit, onDelete, onCompleted }) => {
  const ref = useRef();
  const { translate, currentLanguage } = useLocales();

  const categoryMapping = useMemo(
    () =>
      OPTIONS_CATEGORY.reduce((ac, item) => {
        ac[item] = translate(`options.task.category.${item}`);
        return ac;
      }, {}),
    [currentLanguage]
  );

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: "TODO_ITEM",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ handlerId, canDrop, isOver }, drop] = useDrop({
    accept: "TODO_ITEM",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
    },
    hover(item) {
      onDrop(item, { from: item.index, to: index });
    },
  });

  return (
    <div className="todolist-item" ref={drop}>
      <span className="todo-serial">
        <Ref innerRef={drag}>
          <Button size="small" circular inverted icon={<Icon name="move" />} />
        </Ref>
        {index + 1}
      </span>
      <div className="todo-title">
        <Label className="category-label" color="teal" as="span" ribbon>
          {categoryMapping[item.category]}
        </Label>
        <p>{item.title}</p>
      </div>
      <div className="todo-information">
        <Label
          circular
          color={
            PRIORITY_COLOR[item.priority] ||
            PRIORITY_COLOR[PRIORITY_COLOR.length - 2]
          }
          empty
          key={
            PRIORITY_COLOR[item.priority] ||
            PRIORITY_COLOR[PRIORITY_COLOR.length - 2]
          }
        />
        {translate(`options.task.status.${item.isCompleted}`)}
        <Icon.Group as="span" className="operate-button-group">
          <Tooltip
            title={translate(
              `tooltip.${item.isCompleted ? "undo" : "completed"}`
            )}
            content={
              <Button
                size="small"
                circular
                icon={<Icon name={item.isCompleted ? "undo" : "check"} />}
                onClick={() => onCompleted(item)}
              />
            }
          />

          <Tooltip
            title={translate("tooltip.edit")}
            content={
              <Button
                size="small"
                circular
                icon={<Icon name="edit" />}
                onClick={() => onEdit(item)}
              />
            }
          />

          <Tooltip
            title={translate("tooltip.delete")}
            content={
              <Button
                size="small"
                circular
                icon={<Icon name="delete" />}
                onClick={() => onDelete(item.id)}
              />
            }
          />
        </Icon.Group>
        <p className="time">
          {new Date(item.createTimestamp.seconds * 1000).toLocaleDateString()}
          {new Date(item.createTimestamp.seconds * 1000).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};
