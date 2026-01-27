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
