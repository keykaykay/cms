import type {
  LoadingBarApi,
  MessageApi,
  DialogApi,
  NotificationApi
} from 'naive-ui'

declare global {
  interface Window {
    $loading: LoadingBarApi
    $message: MessageApi
    $dialog: DialogApi
    $notification: NotificationApi
  }
}
