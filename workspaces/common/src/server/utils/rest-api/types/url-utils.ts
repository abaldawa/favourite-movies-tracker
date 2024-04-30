/**
 * @author Abhijit Baldawa
 */

type ExtractParam<Param extends string> = Param extends `:${infer ParamPart}`
  ? ParamPart
  : never;

type ParamKeys<URL extends string> =
  URL extends `${infer ParamA}/${infer ParamB}`
    ? ExtractParam<ParamA> | ParamKeys<ParamB>
    : ExtractParam<URL>;

type UrlToParamObj<URL extends string> = {
  [param in ParamKeys<URL>]: string;
};

export { UrlToParamObj };
