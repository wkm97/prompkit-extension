import styled from "@emotion/styled";
import { Form as FormikForm } from "formik";

export const Form = styled(FormikForm)({
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
    width: '100%'
})