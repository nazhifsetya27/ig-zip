import { useNavigate } from "react-router-dom";
import "./style.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  getAdditionalUserInfo,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { constant } from "../constant";
import { api } from "../api/axios";

export const Login = () => {
  const nav = useNavigate();
  const [see, setSee] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  // const dispatch = useDispatch();
  // const formik = useFormik

  function pindah() {
    nav("/register");
  }

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((res) => {
        const providerData = res.user.providerData[0];
        const userData = {
          username: providerData.displayName,
          email: providerData.email,
          photoURL: providerData.photoURL,
        };
        //send userData to local json api
        patchUserDataToApi(userData);
      })
      .catch((err) => console.log(err));
  };

  const patchUserDataToApi = async (userData) => {
    try {
      const response = await api.post("/users", userData);
      console.log("user data patched to API", response.data);
    } catch (err) {
      console.log("error patchig userData to API", err);
    }
  };

  const loginWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    let result = "";
    await signInWithPopup(auth, provider)
      .then(async (res) => {
        let additional = getAdditionalUserInfo(res);
        console.log(additional);
        const avatar = additional.profile?.picture?.data.url;
        res.user.providerData[0].photoURL = avatar;

        updateProfile(auth.currentUser, {
          photoURL: avatar,
        }).catch((err) => console.log(err));

        console.log(auth.currentUser);

        result = constant.success;
      })
      .catch((err) => (result = err.message));
  };

  useEffect(() => {
    console.log(auth.currentUser);
  }, []);

  const inputHandler = (key, value) => {
    setUser({ ...user, [key]: value });
    console.log(inputHandler);
  };

  const login = async () => {
    const auth = await api.get("/users", {
      params: {
        email: user.email,
        password: user.password,
      },
    });
    console.log("auth.data", auth);
  };

  return (
    <>
      <center>
        <div className="container-main">
          <div className="notif-bar">
            <svg
              width="375"
              height="44"
              viewBox="0 0 375 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.35"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M339.752 17.8333C338.743 17.8333 338.345 17.9103 337.933 18.1304C337.586 18.3162 337.316 18.5859 337.13 18.9333C336.91 19.3449 336.833 19.7436 336.833 20.7518V25.2481C336.833 26.2564 336.91 26.6551 337.13 27.0666C337.316 27.4141 337.586 27.6838 337.933 27.8696C338.345 28.0897 338.743 28.1666 339.752 28.1666H354.915C355.923 28.1666 356.322 28.0897 356.733 27.8696C357.081 27.6838 357.35 27.4141 357.536 27.0666C357.756 26.6551 357.833 26.2564 357.833 25.2481V20.7518C357.833 19.7436 357.756 19.3449 357.536 18.9333C357.35 18.5859 357.081 18.3162 356.733 18.1304C356.322 17.9103 355.923 17.8333 354.915 17.8333H339.752Z"
                stroke="black"
              />
              <path
                opacity="0.4"
                d="M359.333 21V25C360.138 24.6612 360.661 23.8731 360.661 23C360.661 22.1269 360.138 21.3388 359.333 21Z"
                fill="black"
              />
              <path
                d="M340.043 19.3333H354.624C355.218 19.3333 355.434 19.3952 355.651 19.5114C355.868 19.6276 356.039 19.7981 356.155 20.0154C356.271 20.2327 356.333 20.4482 356.333 21.0426V24.9574C356.333 25.5517 356.271 25.7673 356.155 25.9845C356.039 26.2018 355.868 26.3724 355.651 26.4886C355.434 26.6048 355.218 26.6666 354.624 26.6666H340.043C339.448 26.6666 339.233 26.6048 339.015 26.4886C338.798 26.3724 338.628 26.2018 338.511 25.9845C338.395 25.7673 338.333 25.5517 338.333 24.9574V21.0426C338.333 20.4482 338.395 20.2327 338.511 20.0154C338.628 19.7981 338.798 19.6276 339.015 19.5114C339.233 19.3952 339.448 19.3333 340.043 19.3333Z"
                fill="black"
              />
              <path
                d="M323.667 19.6152C325.892 19.6153 328.031 20.4694 329.644 22.001C329.765 22.1192 329.959 22.1177 330.079 21.9976L331.24 20.8273C331.3 20.7664 331.334 20.6839 331.333 20.598C331.333 20.5122 331.298 20.4301 331.237 20.3699C327.005 16.3176 320.329 16.3176 316.097 20.3699C316.035 20.43 316.001 20.5121 316 20.598C315.999 20.6838 316.033 20.7663 316.094 20.8273L317.255 21.9976C317.374 22.1179 317.568 22.1194 317.69 22.001C319.302 20.4693 321.442 19.6152 323.667 19.6152ZM323.667 23.4227C324.889 23.4227 326.068 23.8766 326.974 24.6964C327.097 24.8127 327.29 24.8102 327.409 24.6907L328.569 23.5204C328.63 23.459 328.663 23.3757 328.663 23.2892C328.662 23.2027 328.626 23.1201 328.564 23.0599C325.805 20.4955 321.532 20.4955 318.773 23.0599C318.71 23.1201 318.675 23.2027 318.674 23.2893C318.673 23.3758 318.707 23.4591 318.768 23.5204L319.927 24.6907C320.047 24.8102 320.24 24.8127 320.362 24.6964C321.268 23.8772 322.446 23.4233 323.667 23.4227ZM325.895 26.2158C325.957 26.155 325.991 26.0714 325.989 25.9846C325.988 25.8978 325.95 25.8156 325.886 25.7574C324.605 24.6751 322.729 24.6751 321.449 25.7574C321.384 25.8156 321.347 25.8977 321.345 25.9845C321.343 26.0713 321.377 26.155 321.439 26.2158L323.445 28.2378C323.503 28.2972 323.583 28.3307 323.667 28.3307C323.751 28.3307 323.831 28.2972 323.89 28.2378L325.895 26.2158Z"
                fill="black"
              />
              <path
                d="M295 24.3334H296C296.552 24.3334 297 24.7811 297 25.3334V27.3334C297 27.8856 296.552 28.3334 296 28.3334H295C294.448 28.3334 294 27.8856 294 27.3334V25.3334C294 24.7811 294.448 24.3334 295 24.3334ZM299.667 22.3334H300.667C301.219 22.3334 301.667 22.7811 301.667 23.3334V27.3334C301.667 27.8856 301.219 28.3334 300.667 28.3334H299.667C299.114 28.3334 298.667 27.8856 298.667 27.3334V23.3334C298.667 22.7811 299.114 22.3334 299.667 22.3334ZM304.333 20H305.333C305.886 20 306.333 20.4477 306.333 21V27.3334C306.333 27.8856 305.886 28.3334 305.333 28.3334H304.333C303.781 28.3334 303.333 27.8856 303.333 27.3334V21C303.333 20.4477 303.781 20 304.333 20ZM309 17.6667H310C310.552 17.6667 311 18.1144 311 18.6667V27.3334C311 27.8856 310.552 28.3334 310 28.3334H309C308.448 28.3334 308 27.8856 308 27.3334V18.6667C308 18.1144 308.448 17.6667 309 17.6667Z"
                fill="black"
              />
              <path
                d="M37.089 15.9418C37.5364 15.9453 37.9839 16.0305 38.4313 16.1974C38.8787 16.3643 39.2871 16.6413 39.6564 17.0284C40.0258 17.4119 40.3223 17.9357 40.546 18.5998C40.7697 19.2638 40.8816 20.0966 40.8816 21.098C40.8816 22.0675 40.7893 22.9286 40.6046 23.6815C40.4235 24.4308 40.1607 25.0629 39.8162 25.5778C39.4753 26.0927 39.0598 26.4833 38.5698 26.7496C38.0833 27.016 37.5329 27.1491 36.9185 27.1491C36.3077 27.1491 35.7626 27.0284 35.2832 26.7869C34.8074 26.5419 34.4167 26.2028 34.1113 25.7695C33.8095 25.3327 33.616 24.8267 33.5307 24.2514H34.8304C34.9476 24.7521 35.1802 25.1658 35.5282 25.4925C35.8798 25.8157 36.3432 25.9773 36.9185 25.9773C37.7601 25.9773 38.4242 25.6097 38.9107 24.8746C39.4008 24.1396 39.6458 23.1009 39.6458 21.7585H39.5606C39.3617 22.0568 39.1255 22.3143 38.8521 22.5309C38.5787 22.7475 38.275 22.9144 37.9412 23.0316C37.6074 23.1488 37.2523 23.2074 36.8759 23.2074C36.2509 23.2074 35.6774 23.0529 35.1554 22.744C34.6369 22.4315 34.2214 22.0036 33.9089 21.4602C33.6 20.9134 33.4455 20.2884 33.4455 19.5852C33.4455 18.9176 33.5946 18.3068 33.8929 17.7528C34.1948 17.1953 34.6174 16.7514 35.1607 16.4212C35.7076 16.0909 36.3503 15.9311 37.089 15.9418ZM37.089 17.1136C36.6415 17.1136 36.2385 17.2255 35.8798 17.4492C35.5247 17.6694 35.2424 17.9677 35.0329 18.3441C34.8269 18.717 34.7239 19.1307 34.7239 19.5852C34.7239 20.0398 34.8233 20.4535 35.0222 20.8263C35.2246 21.1957 35.4998 21.4904 35.8478 21.7106C36.1994 21.9272 36.5989 22.0355 37.0464 22.0355C37.3837 22.0355 37.698 21.9698 37.9892 21.8384C38.2804 21.7035 38.5343 21.5206 38.7509 21.2898C38.9711 21.0554 39.1433 20.7908 39.2676 20.4961C39.3919 20.1978 39.454 19.8871 39.454 19.5639C39.454 19.1378 39.351 18.7383 39.1451 18.3654C38.9427 17.9925 38.6621 17.6907 38.3035 17.4599C37.9483 17.229 37.5435 17.1136 37.089 17.1136ZM43.9138 25.6044C43.651 25.6044 43.4255 25.5103 43.2373 25.3221C43.0491 25.1339 42.955 24.9084 42.955 24.6456C42.955 24.3828 43.0491 24.1573 43.2373 23.9691C43.4255 23.7809 43.651 23.6868 43.9138 23.6868C44.1766 23.6868 44.4021 23.7809 44.5903 23.9691C44.7785 24.1573 44.8726 24.3828 44.8726 24.6456C44.8726 24.8196 44.8282 24.9794 44.7394 25.125C44.6542 25.2706 44.5388 25.3878 44.3932 25.4766C44.2512 25.5618 44.0914 25.6044 43.9138 25.6044ZM43.9138 20.0859C43.651 20.0859 43.4255 19.9918 43.2373 19.8036C43.0491 19.6154 42.955 19.3899 42.955 19.1271C42.955 18.8643 43.0491 18.6388 43.2373 18.4506C43.4255 18.2624 43.651 18.1683 43.9138 18.1683C44.1766 18.1683 44.4021 18.2624 44.5903 18.4506C44.7785 18.6388 44.8726 18.8643 44.8726 19.1271C44.8726 19.3011 44.8282 19.4609 44.7394 19.6065C44.6542 19.7521 44.5388 19.8693 44.3932 19.9581C44.2512 20.0433 44.0914 20.0859 43.9138 20.0859ZM46.8515 24.7628V23.6761L51.6455 16.0909H52.4339V17.7741H51.9012L48.279 23.5057V23.5909H54.735V24.7628H46.8515ZM51.9864 27V24.4325V23.9265V16.0909H53.2435V27H51.9864ZM60.4199 16.0909V27H59.0989V17.4759H59.035L56.3716 19.2443V17.902L59.0989 16.0909H60.4199Z"
                fill="black"
              />
            </svg>
          </div>
          <div
            style={{
              fontSize: "12px",
              marginBottom: "195px",
              fontWeight: "400",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            English &nbsp;
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="6"
                height="4"
                viewBox="0 0 6 4"
                fill="none"
              >
                <path
                  d="M2.75 2.24017L0.670649 0.117503C0.517229 -0.0391135 0.268485 -0.0391135 0.115065 0.117503C-0.0383552 0.274119 -0.0383552 0.528045 0.115065 0.684662L2.47221 3.09091C2.62563 3.24753 2.87437 3.24753 3.02779 3.09091L5.38493 0.684661C5.53836 0.528045 5.53836 0.274119 5.38493 0.117503C5.23151 -0.0391138 4.98277 -0.0391137 4.82935 0.117503L2.75 2.24017Z"
                  fill="#868686"
                />
              </svg>
            </span>
          </div>

          <div className="ig-logo">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="176"
              height="50"
              viewBox="0 0 176 50"
              fill="none"
            >
              <g clip-path="url(#clip0_148_76)">
                <path
                  d="M9.29011 0.308855C5.71237 1.80749 1.77984 6.03591 0.537714 11.3476C-1.03557 18.0753 5.51032 20.9212 6.04765 19.9893C6.67949 18.8931 4.8747 18.5226 4.50313 15.0315C4.02299 10.5226 6.11922 5.48454 8.75758 3.27392C9.2473 2.86297 9.22436 3.43488 9.22436 4.49207C9.22436 6.38283 9.11991 23.3568 9.11991 26.8993C9.11991 31.6924 8.92196 33.2061 8.56614 34.702C8.20621 36.2174 7.62676 37.2417 8.06545 37.6363C8.55587 38.0774 10.6497 37.0277 11.8617 35.3363C13.3151 33.3075 13.824 30.8705 13.9155 28.225C14.0257 25.0352 14.0209 19.9736 14.0257 17.0866C14.0298 14.439 14.0702 6.68591 13.9792 2.02495C13.9569 0.881116 10.7863 -0.318199 9.29011 0.308855Z"
                  fill="black"
                />
                <path
                  d="M136.325 22.7414C136.21 25.2335 135.658 27.1811 134.974 28.5551C133.648 31.215 130.898 32.0407 129.73 28.2174C129.094 26.1332 129.064 22.6523 129.521 19.7438C129.987 16.7811 131.288 14.5434 133.441 14.7452C135.565 14.9448 136.559 17.6811 136.325 22.7414ZM100.52 38.2024C100.492 42.3428 99.84 45.9729 98.4427 47.0277C96.4605 48.5229 93.7965 47.401 94.3482 44.3797C94.8362 41.7061 97.1447 38.9756 100.526 35.6393C100.526 35.6393 100.533 36.4003 100.52 38.2024ZM99.9793 22.7171C99.8581 24.9869 99.2697 27.2667 98.6276 28.5551C97.3023 31.215 94.5324 32.0465 93.3845 28.2174C92.5995 25.601 92.7876 22.2154 93.1756 20.0818C93.6797 17.3136 94.9016 14.7455 97.0951 14.7455C99.228 14.7455 100.28 17.0856 99.9793 22.7171ZM79.2379 22.6828C79.1078 25.0863 78.6389 27.0955 77.8865 28.5551C76.5249 31.1969 73.8311 32.0345 72.6434 28.2174C71.7869 25.465 72.0783 21.7123 72.4345 19.6849C72.9632 16.6763 74.2872 14.5434 76.354 14.7455C78.4769 14.953 79.5088 17.6815 79.2379 22.6828ZM174.29 25.4904C173.771 25.4904 173.534 26.0253 173.338 26.9253C172.659 30.0568 171.944 30.7633 171.024 30.7633C169.994 30.7633 169.07 29.2133 168.832 26.1099C168.645 23.6695 168.675 19.177 168.914 14.7082C168.963 13.79 168.709 12.8815 166.247 11.9869C165.187 11.602 163.647 11.0352 162.88 12.8866C160.713 18.1174 159.865 22.2702 159.665 23.9565C159.655 24.0438 159.548 24.0619 159.529 23.8578C159.402 22.5068 159.118 20.0513 159.082 14.8931C159.076 13.8866 158.863 13.0301 157.752 12.3287C157.031 11.8732 154.842 11.0684 154.054 12.0263C153.371 12.8092 152.58 14.9167 151.758 17.4154C151.091 19.4462 150.626 20.8195 150.626 20.8195C150.626 20.8195 150.634 15.3407 150.642 13.2623C150.646 12.4784 150.108 12.2171 149.946 12.1698C149.216 11.9582 147.778 11.6044 147.168 11.6044C146.414 11.6044 146.23 12.0249 146.23 12.6386C146.23 12.7191 146.111 19.852 146.111 24.8397C146.111 25.0565 146.111 25.2928 146.112 25.5441C145.696 27.8366 144.345 30.9482 142.876 30.9482C141.404 30.9482 140.71 29.6476 140.71 23.7013C140.71 20.2325 140.815 18.7239 140.866 16.215C140.895 14.7698 140.953 13.6602 140.95 13.4085C140.939 12.6362 139.604 12.2469 138.982 12.103C138.358 11.9582 137.815 11.9017 137.392 11.926C136.792 11.9602 136.368 12.353 136.368 12.8941C136.368 13.1845 136.371 13.7359 136.371 13.7359C135.599 12.5222 134.357 11.6777 133.53 11.4328C131.304 10.7719 128.982 11.3575 127.23 13.8092C125.837 15.7568 124.998 17.9633 124.667 21.1328C124.426 23.4503 124.505 25.8 124.934 27.7873C124.415 30.0297 123.453 30.9482 122.398 30.9482C120.867 30.9482 119.758 28.4503 119.887 24.1291C119.971 21.2869 120.54 19.2924 121.162 16.4068C121.427 15.1767 121.212 14.5328 120.671 13.9157C120.176 13.3496 119.12 13.0602 117.603 13.4157C116.522 13.6695 114.977 13.9424 113.563 14.152C113.563 14.152 113.648 13.8112 113.718 13.2112C114.086 10.064 110.666 10.3191 109.574 11.3243C108.923 11.9246 108.48 12.6325 108.312 13.9051C108.044 15.9249 109.692 16.8777 109.692 16.8777C109.152 19.3517 107.827 22.5832 106.459 24.9198C105.726 26.1715 105.166 27.0993 104.442 28.0852C104.419 24.1284 104.445 20.1715 104.52 16.2154C104.55 14.7702 104.607 13.69 104.604 13.438C104.596 12.8736 104.266 12.6599 103.58 12.39C102.974 12.151 102.256 11.9859 101.512 11.9277C100.573 11.8551 100.007 12.3527 100.022 12.9417C100.025 13.053 100.025 13.7359 100.025 13.7359C99.253 12.5222 98.0108 11.6777 97.1845 11.4328C94.9584 10.7719 92.6358 11.3575 90.8838 13.8092C89.4917 15.7568 88.58 18.4904 88.3215 21.1089C88.081 23.5489 88.1252 25.6226 88.4533 27.3698C88.0995 29.1191 87.0817 30.9486 85.9314 30.9486C84.4602 30.9486 83.6232 29.6476 83.6232 23.7013C83.6232 20.2325 83.7273 18.7239 83.7786 16.215C83.8084 14.7702 83.8656 13.6602 83.8626 13.4085C83.8516 12.6362 82.5163 12.2472 81.8947 12.103C81.2447 11.9523 80.6834 11.8975 80.2523 11.9294C79.6838 11.9715 79.2838 12.4808 79.2838 12.8606V13.7359C78.5115 12.5222 77.2694 11.6777 76.443 11.4328C74.217 10.7719 71.9074 11.3671 70.1423 13.8092C68.9917 15.4013 68.0598 17.1664 67.5804 21.0739C67.4417 22.203 67.3804 23.2609 67.3886 24.2489C66.9297 27.0558 64.9023 30.2907 63.2444 30.2907C62.2742 30.2907 61.3499 28.4085 61.3499 24.3979C61.3499 19.0554 61.6807 11.4486 61.7369 10.7157C61.7369 10.7157 63.8317 10.6801 64.2372 10.6753C65.2824 10.6636 66.2287 10.6886 67.6208 10.6171C68.3187 10.5818 68.9913 8.07597 68.2708 7.76604C67.9441 7.62563 65.6362 7.50303 64.7211 7.48351C63.9519 7.46638 61.8102 7.30748 61.8102 7.30748C61.8102 7.30748 62.0023 2.25851 62.0471 1.72529C62.0848 1.28042 61.5095 1.05166 61.18 0.912958C60.378 0.573917 59.6605 0.411246 58.8102 0.235903C57.6348 -0.00656264 57.1019 0.230766 56.9978 1.2222C56.841 2.72734 56.7598 7.1359 56.7598 7.1359C55.8975 7.1359 52.9516 6.96741 52.0893 6.96741C51.2879 6.96741 50.4228 10.414 51.531 10.4565C52.8057 10.5058 55.0273 10.5489 56.4999 10.5928C56.4999 10.5928 56.4341 18.3249 56.4341 20.7126C56.4341 20.966 56.4355 21.2109 56.4369 21.4482C55.6263 25.6726 52.7715 27.9547 52.7715 27.9547C53.3845 25.1599 52.1321 23.0609 49.8763 21.2842C49.0451 20.6297 47.4043 19.3904 45.5687 18.0321C45.5687 18.0321 46.6317 16.9842 47.5749 14.876C48.2427 13.3821 48.2718 11.6736 46.6317 11.2965C43.9221 10.6732 41.6882 12.6633 41.0218 14.788C40.5054 16.4339 40.7807 17.6547 41.7924 18.9232C41.866 19.016 41.9465 19.1109 42.0287 19.2061C41.4174 20.3849 40.5769 21.9722 39.8653 23.203C37.89 26.6208 36.3978 29.3236 35.2701 29.3236C34.3687 29.3236 34.3807 26.5791 34.3807 24.0095C34.3807 21.7945 34.5444 18.464 34.6752 15.0164C34.7184 13.876 34.1478 13.2263 33.1923 12.638C32.6115 12.2804 31.3721 11.5777 30.6543 11.5777C29.5797 11.5777 26.4797 11.7239 23.5509 20.1965C23.1817 21.2643 22.4564 23.2102 22.4564 23.2102L22.5191 13.0215C22.5191 12.7825 22.3917 12.5517 22.1002 12.3938C21.6067 12.1256 20.2886 11.5777 19.1163 11.5777C18.5581 11.5777 18.279 11.8373 18.279 12.3551L18.1769 28.2955C18.1769 29.5068 18.2084 30.9198 18.3283 31.5376C18.4475 32.1561 18.641 32.6595 18.88 32.9589C19.1194 33.2578 19.3958 33.4863 19.8516 33.5801C20.2759 33.6674 22.5992 33.9657 22.7201 33.078C22.8646 32.0136 22.8704 30.863 24.0903 26.5705C25.9896 19.8876 28.4656 16.6273 29.63 15.4691C29.8338 15.2671 30.066 15.2547 30.0547 15.5859C30.0054 17.051 29.8304 20.7126 29.7129 23.8222C29.3975 32.1458 30.9115 33.6887 33.0756 33.6887C34.731 33.6887 37.0646 32.0438 39.566 27.8801C40.9597 25.5597 42.3471 23.2355 43.728 20.9075C44.4858 21.6092 45.3369 22.3643 46.1869 23.1712C48.1629 25.0465 48.8115 26.8287 48.381 28.5191C48.0523 29.8113 46.8122 31.1431 44.6057 29.8489C43.9626 29.4712 43.6879 29.1791 43.0413 28.7534C42.6941 28.525 42.1636 28.4565 41.8454 28.6962C41.0194 29.3188 40.5468 30.1113 40.2769 31.0921C40.0146 32.0465 40.9704 32.551 41.9615 32.9924C42.8146 33.3722 44.6485 33.7164 45.8177 33.7554C50.3742 33.9078 54.0245 31.5554 56.5656 25.4873C57.0204 30.728 58.9561 33.6934 62.3194 33.6934C64.568 33.6934 66.8225 30.7869 67.8084 27.9277C68.0913 29.0931 68.5105 30.1068 69.0516 30.964C71.643 35.0702 76.6704 34.1866 79.1958 30.6996C79.9766 29.6222 80.0954 29.2352 80.0954 29.2352C80.4639 32.5273 83.1153 33.6777 84.6331 33.6777C86.3334 33.6777 88.0886 32.8739 89.3191 30.1041C89.4632 30.4047 89.6208 30.6921 89.7927 30.964C92.3841 35.0702 97.4119 34.1866 99.9372 30.6996C100.056 30.5359 100.16 30.388 100.25 30.2544L100.324 32.4171L97.9989 34.5496C94.1016 38.1215 91.1413 40.8304 90.9235 43.9856C90.6461 48.0085 93.9071 49.5037 96.3776 49.6996C98.9965 49.9075 101.243 48.4595 102.622 46.4332C103.836 44.6493 104.63 40.8102 104.572 37.0188C104.549 35.5003 104.51 33.5698 104.48 31.5003C105.849 29.9116 107.39 27.9034 108.809 25.5534C110.356 22.9921 112.013 19.5523 112.862 16.8753C112.862 16.8753 114.302 16.888 115.839 16.7873C116.33 16.7551 116.472 16.8558 116.381 17.2157C116.271 17.6513 114.439 24.7174 116.111 29.4246C117.255 32.6472 119.835 33.6835 121.365 33.6835C123.155 33.6835 124.868 32.3315 125.786 30.3239C125.897 30.5476 126.012 30.764 126.139 30.9643C128.73 35.0705 133.74 34.1811 136.283 30.6996C136.857 29.914 137.183 29.2352 137.183 29.2352C137.728 32.6428 140.378 33.6952 141.896 33.6952C143.477 33.6952 144.978 33.0469 146.195 30.1664C146.246 31.4349 146.326 32.4719 146.452 32.7986C146.529 32.9989 146.979 33.2496 147.305 33.3708C148.752 33.9071 150.227 33.6537 150.772 33.5434C151.151 33.4667 151.445 33.1633 151.486 32.3804C151.592 30.3239 151.527 26.8688 152.15 24.3006C153.196 19.9914 154.173 18.3198 154.636 17.4924C154.895 17.0284 155.187 16.952 155.198 17.4428C155.22 18.4359 155.269 21.3513 155.675 25.2691C155.972 28.15 156.37 29.853 156.676 30.3924C157.548 31.9335 158.625 32.0065 159.503 32.0065C160.061 32.0065 161.228 31.8523 161.124 30.8715C161.072 30.3934 161.162 27.4387 162.193 23.1931C162.867 20.4205 163.99 17.9157 164.395 16.9996C164.545 16.6619 164.615 16.928 164.612 16.9801C164.527 18.8893 164.335 25.1345 165.113 28.5503C166.168 33.1773 169.218 33.6952 170.281 33.6952C172.55 33.6952 174.406 31.9691 175.031 27.4273C175.181 26.3342 174.958 25.4904 174.29 25.4904Z"
                  fill="black"
                />
              </g>
              <defs>
                <clipPath id="clip0_148_76">
                  <rect width="175.342" height="50" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>

          <div>
            <input
              type="text"
              className="input"
              placeholder="Phone number, email or username"
              required
              onChange={(e) => inputHandler("email", e.target.value)}
            />
          </div>

          <div>
            <div className="input-password">
              <input
                type="text"
                className="input"
                placeholder="password"
                required
                onChange={(e) => inputHandler("password", e.target.value)}
              />
              <svg
                className="hidden-svg"
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="12"
                viewBox="0 0 13 12"
                fill="none"
              >
                <g clip-path="url(#clip0_148_92)">
                  <path
                    d="M6.5 2.11763C4.01621 2.11763 1.76378 3.60304 0.101718 6.01573C-0.0339061 6.21339 -0.0339061 6.48955 0.101718 6.68721C1.76378 9.10281 4.01621 10.5882 6.5 10.5882C8.98379 10.5882 11.2362 9.10281 12.8983 6.69012C13.0339 6.49245 13.0339 6.2163 12.8983 6.01864C11.2362 3.60303 8.98379 2.11763 6.5 2.11763ZM6.67817 9.33536C5.02941 9.44873 3.66784 7.96332 3.77156 6.15816C3.85665 4.66985 4.96026 3.46351 6.32183 3.37049C7.97059 3.25712 9.33216 4.74252 9.22844 6.54768C9.14069 8.03309 8.03708 9.23944 6.67817 9.33536ZM6.59573 7.95751C5.70753 8.01855 4.97356 7.21917 5.03206 6.24828C5.07727 5.44598 5.67296 4.79775 6.40692 4.74543C7.29513 4.68439 8.0291 5.48377 7.97059 6.45466C7.92273 7.25986 7.32704 7.90809 6.59573 7.95751Z"
                    fill="#848484"
                  />
                  <path
                    d="M1.13489 1.10921L11.486 11.2261"
                    stroke="#848484"
                    stroke-width="1.25"
                    stroke-linecap="square"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_148_92">
                    <rect width="13" height="12" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>

          <div className="sign-up">
            <button>
              <span
                style={{ opacity: "0.4", fontWeight: "400" }}
                onClick={login}
              >
                Sign In
              </span>
            </button>
          </div>

          <div className="ensure">
            Already have an account? &nbsp;
            <button className="sign-in" onClick={pindah}>
              Sign Up
            </button>
          </div>

          <div className="container-line">
            <div className="line1">
              <svg
                width="130"
                height="1"
                viewBox="0 0 130 1"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line y1="0.5" x2="130" y2="0.5" stroke="#D3D3D3" />
              </svg>
            </div>
            <div className="or">OR</div>
            <div className="line2">
              <svg
                width="130"
                height="1"
                viewBox="0 0 130 1"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line y1="0.5" x2="130" y2="0.5" stroke="#D3D3D3" />
              </svg>
            </div>
          </div>

          <div className="sign-up-with-fb">
            <div className="fb-logo"></div>

            <button onClick={loginWithFacebook}>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <rect
                    x="-6.10352e-05"
                    y="1.90735e-05"
                    width="20"
                    height="20"
                    rx="10"
                    fill="#1877F2"
                  />
                  <path
                    d="M12.5127 10.7305L12.9704 7.8399H10.1075V5.9649C10.1075 5.17389 10.5066 4.4024 11.7889 4.4024H13.0913V1.94146C13.0913 1.94146 11.9099 1.74615 10.7808 1.74615C8.42197 1.74615 6.88165 3.13092 6.88165 5.63678V7.8399H4.26068V10.7305H6.88165V17.7188C7.40786 17.7989 7.94617 17.8399 8.49455 17.8399C9.04294 17.8399 9.58125 17.7989 10.1075 17.7188V10.7305H12.5127Z"
                    fill="white"
                  />
                </svg>
              </span>
              <span>Login with Facebook</span>
            </button>
            <button onClick={loginWithGoogle}>
              <span>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png"
                  alt=""
                  style={{ width: "15px", height: "15px", marginRight: "15px" }}
                />
              </span>
              <span>Login with Google</span>
            </button>
          </div>
        </div>
      </center>
    </>
  );
};