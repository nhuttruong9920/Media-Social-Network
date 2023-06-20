import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  ArrayField,
  useListContext,
} from 'react-admin'
import { CustomBanButton } from '../components'
import { Fragment } from 'react'

const CustomBulkActions = (props) => (
  <Fragment>
    <CustomBanButton label="Ban" model={'user'} {...props} />
  </Fragment>
)

const LengthField = (props) => {
  const { ids, loaded } = useListContext(props)

  return loaded ? ids.length : null
}

export const UserList = (props) => (
  <List
    {...props}
    rowClick="show"
    perPage={100}
    bulkActionButtons={<CustomBulkActions />}
  >
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="_doc.email" />
      <TextField source="_doc.fullname" />
      <BooleanField source="_doc.banned" />
      <ArrayField source="_doc.reports">
        <LengthField />
      </ArrayField>
    </Datagrid>
  </List>
)
