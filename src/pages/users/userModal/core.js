// import { Alert } from "../../utils/alerts";
import * as Yup from "yup";
// import { convertFormDateToMiladi } from "../../utils/convertDate";
import { addNewUserService, editUserService } from "@/services/users";
import { UserStatus } from "@/enums/userStatus";

export const initialValues = {
  name: "",
  username: "",
  email: "",
  password: "",
  is_admin: false,
  status: UserStatus.ACTIVE,
  roles: [],
  avatar: null,
};

export const onSubmit = async (values, actions, setData, userId) => {
  // values = {
  //     ...values,
  //     birth_date: values.birth_date ? convertFormDateToMiladi(values.birth_date) : null
  // }
  if (userId) {
    const res = await editUserService(userId, values);
    if (res.status == 200) {
      // Alert('انجام شد', res.data.message, 'success')
      setTimeout(() => {
        toast.success("کاربر باموفقیت ویرایش شد", "موفق");
      }, 200);

      clearTimeout(timer);
      setData((lastData) => {
        let newData = [...lastData];
        let index = newData.findIndex((d) => d.id == userId);
        newData[index] = res.data.data;
        return newData;
      });
    }
  } else {
    const res = await addNewUserService(values);
    if (res.status == 201) {
      // Alert('انجام شد', res.data.message, 'success')
      setTimeout(() => {
        toast.success("کاربر باموفقیت ایجاد شد", "موفق");
      }, 200);
      actions.resetForm();
      setData((old) => [...old, res.data.data]);
    }
  }
};

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("نام الزامی است")
    .max(255, "حداکثر 255 کاراکتر مجاز است"),

  username: Yup.string()
    .required("نام کاربری الزامی است")
    .min(3, "حداقل 3 کاراکتر وارد کنید")
    .max(255, "حداکثر 255 کاراکتر مجاز است")
    .matches(
      /^[a-zA-Z0-9_-]+$/,
      "نام کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد، - و _ باشد",
    ),

  email: Yup.string()
    .email("فرمت ایمیل صحیح نیست")
    .required("ایمیل الزامی است"),

  password: Yup.string().when("isEditing", {
    is: true,
    then: () => Yup.string(),
    otherwise: () =>
      Yup.string()
        .required("رمز عبور الزامی است")
        .min(6, "رمز عبور حداقل باید 6 کاراکتر باشد"),
  }),

  is_admin: Yup.boolean(),

  status: Yup.string()
    .oneOf(Object.values(UserStatus), "وضعیت انتخاب شده معتبر نیست")
    .required("وضعیت الزامی است"),

  roles: Yup.array().min(1, "حداقل یک نقش انتخاب کنید"),

  avatar: Yup.mixed().nullable(),
});
