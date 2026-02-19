/** Used with useActionState for server actions that return { isError, message }. */
export type SimpleActionState = { isError: boolean; message: string };

export const INITIAL_ACTION_STATE: SimpleActionState = {
    isError: false,
    message: "",
};

type FormResponseBase<T = void> = {
    isError: boolean;
    data?: T | null;
};

export type FormResponse<T = void> =
    | (FormResponseBase<T> & {
          isError: true;
          errors: string[] | string;
      })
    | (FormResponseBase<void> & {
          isError: false;
          message: string;
      })
    | (FormResponseBase<T> & {
          isError: false;
          message: string;
          data: T;
      });
