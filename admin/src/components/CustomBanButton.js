import * as React from 'react'
import { Fragment, useState } from 'react'
import {
  Button,
  Confirm,
  useUpdateMany,
  useRefresh,
  useNotify,
  useUnselectAll,
} from 'react-admin'

export const CustomBanButton = ({ model, selectedIds }) => {
  const [open, setOpen] = useState(false)
  const refresh = useRefresh()
  const notify = useNotify()
  const unselectAll = useUnselectAll()
  const [updateMany, { loading }] = useUpdateMany(
    model,
    selectedIds,
    { ban: true },
    {
      onSuccess: () => {
        refresh()
        notify(`${model}s banned`)
        unselectAll(model)
      },
      onFailure: (error) =>
        notify(`Error: ${model}s not updated`, { type: 'warning' }),
    }
  )
  const handleClick = () => setOpen(true)
  const handleDialogClose = () => setOpen(false)

  const handleConfirm = () => {
    updateMany()
    setOpen(false)
  }

  return (
    <Fragment>
      <Button label="Toggle Ban" onClick={handleClick} />
      <Confirm
        isOpen={open}
        loading={loading}
        title="Ban"
        content="Are you sure you want to ban these items?"
        onConfirm={handleConfirm}
        onClose={handleDialogClose}
      />
    </Fragment>
  )
}
