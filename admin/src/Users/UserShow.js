import {
  Show,
  SimpleShowLayout,
  BooleanField,
  TextField,
  ArrayField,
  Datagrid,
  DateField,
} from 'react-admin'

export const UserShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="user.email" />
      <TextField source="user.fullname" />
      <BooleanField source="user.banned" />
      <ArrayField source="user.reports">
        <Datagrid>
          <TextField source="reason" />
          <DateField source="createdAt" />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
)
