import styled from "@emotion/styled";
import { openManager, useManager } from "./context"
import { Formik, type FieldProps, Field, Form } from "formik";
import { InputText, InputTextContainer, InputTextLabel } from "../form/input";
import { TextArea, TextAreaContainer, TextAreaLabel } from "../form/text-area";
import { SolidButton } from "../button/styled";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from 'uuid';
import { tokens } from "~shared/theme/tokens";
import { IDBPrompkitAPI } from "~shared/indexeddb/prompkit";

const StyledForm = styled(Form)({
  display: "flex",
  flexDirection: "column"
})

const Layout = styled(motion.div)({
  width: "60vw",
  padding: `${tokens.spacing[4]} ${tokens.spacing[4]}`,
})

const SubmitButton = styled(SolidButton)({
  borderRadius: tokens.borderRadius.md,
  fontWeight: 'bold',
  paddingInlineStart: '1em',
  paddingInlineEnd: '1em'
})

export const ManagerEditor = () => {
  const { state, dispatch } = useManager()
  const { editor } = state;

  const validateName = (value: string) => {
    let error
    if (!value) {
      error = 'Name is required'
    }
    return error
  }

  const validateTemplate = (value: string) => {
    let error
    if (!value) {
      error = 'Prompt template is required'
    }
    return error
  }

  return (
    <Layout
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Formik
        initialValues={{ name: editor?.name ?? "", template: editor?.template ?? "" }}
        onSubmit={(values, actions) => {
          const { name, template } = values
          if (editor?.id) {
            IDBPrompkitAPI.upsertPromptTemplate({ ...editor, name, template })
          } else {
            const payload = {
              id: uuidv4(),
              name,
              template,
              createdAt: Date.now(),
              updatedAt: Date.now()
            }
            IDBPrompkitAPI.upsertPromptTemplate(payload)
          }
          openManager(dispatch)
        }}
      >
        {(props) => (
          <StyledForm>
            <Field name='name' validate={validateName}>
              {({ field, form }: FieldProps<string, { name: string }>) => (
                <InputTextContainer>
                  <InputTextLabel htmlFor='name'>Name</InputTextLabel>
                  <InputText id="name" {...field} autoComplete="prompt-name" autoFocus placeholder="Name..." />
                </InputTextContainer>
              )}
            </Field>
            <Field name='template' validate={validateTemplate}>
              {({ field, form }: FieldProps<string, { template: string }>) => (
                <TextAreaContainer>
                  <TextAreaLabel htmlFor="template">Template</TextAreaLabel>
                  <TextArea id="template" placeholder="Type something..." {...field} />
                </TextAreaContainer>
              )}
            </Field>
            <SubmitButton
              type='submit'
            >
              Submit
            </SubmitButton>
          </StyledForm>
        )}
      </Formik>
    </Layout>
  )
}