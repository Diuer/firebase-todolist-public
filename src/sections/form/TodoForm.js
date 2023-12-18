import { useMemo } from "react";
import i18next from "i18next";
import * as Yup from "yup";
import { Card, Button, Modal } from "semantic-ui-react";

import { OPTIONS_CATEGORY } from "../../constants/enum";
import { createTodoItem, updateTodoItem } from "../../utils/firebase";
import FormProvider from "../../contexts/form";
import useLocales from "../../locales/useLocales";
import { TextField, SelectField } from "../../components/form";

export const TodoForm = ({ open, data, isEdit, onClose, onSubmit }) => {
  const { translate, currentLanguage } = useLocales();
  const optionsCategory = useMemo(
    () =>
      OPTIONS_CATEGORY.map((item) => ({
        text: translate(`options.task.category.${item}`),
        value: item,
      })),
    [currentLanguage]
  );

  const schema = Yup.object({
    title: Yup.string()
      .nullable()
      .default("")
      .max(10)
      .required(translate("validate.required"))
      .noSpace(),
    category: Yup.string()
      .nullable()
      .default("")
      .required(translate("validate.required")),
  });

  const defaultValues = useMemo(
    () => ({
      ...data,
      title: data?.title || "",
      category: data?.category || "",
    }),
    [data]
  );

  const handleReset = () => {
    onClose();
  };

  const handleSubmit = async ({ id, ...values }) => {
    if (isEdit && id) {
      await updateTodoItem(id, values);
    } else if (id) {
      await createTodoItem(values);
    }

    onSubmit();
  };

  return (
    <Modal
      onClose={onClose}
      open={open}
      dimmer="blurring"
      style={{ width: "auto" }}
    >
      <Modal.Content>
        <FormProvider
          schema={schema}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onReset={handleReset}
        >
          <Card centered>
            <Card.Content textAlign="center">
              <Card.Header>
                {translate(isEdit ? "title.task.edit" : "title.task.create")}
              </Card.Header>
              <Card.Description>
                {translate("please.input.information")}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <TextField name="title" label={translate("field.task.name")} />
              <SelectField
                name="category"
                label={translate("field.task.category")}
                options={optionsCategory}
                placeholder="select category"
              />
            </Card.Content>
            <Card.Content extra textAlign="right">
              <Button.Group>
                <Button type="reset">{translate("button.cancel")}</Button>
                <Button.Or />
                <Button positive type="submit">
                  {translate("button.save")}
                </Button>
              </Button.Group>
            </Card.Content>
          </Card>
        </FormProvider>
      </Modal.Content>
    </Modal>
  );
};
