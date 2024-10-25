import React, { FocusEventHandler, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Label } from "./label";
import { motion } from "framer-motion";

interface FormData {
  name: string;
  role: string;
  contact: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
  } = useForm<FormData>();
  const [messageSent, isMessageSent] = useState(false);

  const [nameValid, isNameValid] = useState(false);
  const [roleValid, isRoleValid] = useState(false);
  const [contactValid, isContactValid] = useState(false);

  const [displayedNameString, setDisplayedNameString] = useState<string>("");
  const [displayedRoleString, setDisplayedRoleString] = useState<string>("");
  const [displayedContactString, setDisplayedContactString] =
    useState<string>("");
  const [displayedMessageString, setDisplayedMessageString] =
    useState<string>("");

  const onSubmit = (data: FormData) => {
    console.log("Name:", data.name);
    console.log("Name:", data.role);
    console.log("Email:", data.contact);
    console.log("Message:", data.message);
    isMessageSent(true);
    reset();
  };

  // Trigger name input
  useEffect(() => {
    const inputs = document.querySelectorAll("input[type='text']");
    const resizeInput = (e: Event) => {
      const el = e.target as HTMLInputElement;
      if (!el) return;
      el.style.width = el.value.length + 3 + "ch";
    };
    inputs.forEach((input: Element) =>
      input.addEventListener("input", resizeInput)
    );

    let i = 0;
    const stringResponse = "Salut ! je m'appelle ";

    const intervalId = setInterval(() => {
      setDisplayedNameString(stringResponse.slice(0, i));

      i++;

      if (i > stringResponse.length) {
        clearInterval(intervalId);
      }
    }, 20);

    return () => clearInterval(intervalId);
  }, []);

  // Trigger role input
  useEffect(() => {
    if (nameValid === true) {
      const inputs = document.querySelectorAll("input[type='text']");
      const secondInput = inputs[1] as HTMLInputElement;
      secondInput.focus();

      let i = 0;
      const stringResponse = "Je suis ";

      const intervalId = setInterval(() => {
        setDisplayedRoleString(stringResponse.slice(0, i));

        i++;

        if (i > stringResponse.length) {
          clearInterval(intervalId);
        }
      }, 20);
      return () => clearInterval(intervalId);
    }
  }, [nameValid]);

  // Trigger contact input
  useEffect(() => {
    if (roleValid === true) {
      const inputs = document.querySelectorAll("input[type='text']");
      const thirdInput = inputs[2] as HTMLInputElement;
      thirdInput.focus();

      let i = 0;
      const stringResponse = "Mon contact mail/tel :  ";

      const intervalId = setInterval(() => {
        setDisplayedContactString(stringResponse.slice(0, i));

        i++;

        if (i > stringResponse.length) {
          clearInterval(intervalId);
        }
      }, 20);
      return () => clearInterval(intervalId);
    }
  }, [roleValid]);

  // Trigger message input
  useEffect(() => {
    if (contactValid === true) {
      const inputs = document.querySelectorAll("textarea");
      const textareaInput = inputs[0] as HTMLTextAreaElement;
      textareaInput.focus();

      let i = 0;
      const stringResponse = "J'aimerais te parler de :";

      const intervalId = setInterval(() => {
        setDisplayedMessageString(stringResponse.slice(0, i));

        i++;

        if (i > stringResponse.length) {
          clearInterval(intervalId);
        }
      }, 35);
      return () => clearInterval(intervalId);
    }
  }, [contactValid]);

  const validateName: FocusEventHandler<HTMLInputElement> = (e) => {
    const el = e.target as HTMLInputElement;
    if (!el) return;
    return el.value.length !== 0 ? isNameValid(true) : isNameValid(false);
  };
  const validateRole: FocusEventHandler<HTMLInputElement> = (e) => {
    const el = e.target as HTMLInputElement;
    if (!el) return;
    return el.value.length !== 0 ? isRoleValid(true) : isRoleValid(false);
  };

  const validateContact: FocusEventHandler<HTMLInputElement> = (e) => {
    const el = e.target as HTMLInputElement;
    if (!el) return;
    return el.value.length !== 0 ? isContactValid(true) : isContactValid(false);
  };

  return (
    <div className="relative w-[95%] md:w-[80%] lg:w-[60%] h-[60%] flex flex-col bg-black/50 backdrop-blur-xl rounded-tl-md rounded-tr-md shadow-xl font-mono">
      <div className="relative h-10 w-full bg-[#121728] rounded-tl-md rounded-tr-md flex justify-center">
        <div className="absolute top-0 left-0 w-24 h-full flex justify-center items-center gap-2 rounded-tl-md">
          <div className="w-4 h-4 rounded-full bg-red-500 cursor-pointer"></div>
          <div className="w-4 h-4 rounded-full bg-orange-500 cursor-pointer"></div>
          <div
            className="w-4 h-4 rounded-full bg-green-500 cursor-pointer"
            onClick={() => alert("reset form")}
          ></div>
        </div>
        <div className="h-full flex justify-center items-center text-white">
          julien.feger@gmail.com
        </div>
      </div>
      <div className="p-4 flex flex-col grow w-full justify-between text-white overflow-hidden">
        <motion.form
          initial={{ opacity: 1, y: 0 }}
          animate={messageSent ? { opacity: 0, y: -100 } : { opacity: 1, y: 0 }}
          onSubmit={handleSubmit(onSubmit)}
          className="h-full w-full flex flex-col justify-start"
        >
          <div className="flex justify-start items-center min-h-16">
            <Label htmlFor="name" className="text-md lg:text-2xl">
              {displayedNameString}
            </Label>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              style={{ originX: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Input
                {...register("name", { required: true })}
                id="name"
                type="text"
                className="bg-transparent text-green-300 border-b min-w-[10ch] w-0 ml-2 border-white outline-none text-md lg:text-2xl"
                onBlur={validateName}
              />
            </motion.div>

            {!nameValid && <CursorSVG />}
          </div>

          <motion.div
            animate={
              nameValid
                ? { opacity: 1, pointerEvents: "auto" }
                : { opacity: 0, pointerEvents: "none" }
            }
            className="flex justify-start items-center min-h-16"
          >
            <Label htmlFor="role" className="text-md lg:text-2xl">
              {displayedRoleString}
            </Label>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: nameValid ? 1 : 0 }}
              style={{ originX: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Input
                {...register("role", { required: true })}
                id="role"
                type="text"
                className="bg-transparent text-green-300 border-b min-w-[10ch] w-0 ml-2 text-md lg:text-2xl border-white outline-none"
                onBlur={validateRole}
              />
            </motion.div>

            {!roleValid && <CursorSVG />}
          </motion.div>

          <motion.div
            animate={
              nameValid && roleValid
                ? { opacity: 1, pointerEvents: "auto" }
                : { opacity: 0, pointerEvents: "none" }
            }
            className="flex justify-start items-center min-h-16"
          >
            <Label htmlFor="contact" className="text-md lg:text-2xl">
              {displayedContactString}
            </Label>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: roleValid ? 1 : 0 }}
              style={{ originX: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Input
                {...register("contact", { required: true })}
                id="contact"
                type="text"
                className="bg-transparent text-green-300 border-b min-w-[10ch] w-0 ml-2 text-md lg:text-2xl border-white outline-none"
                onBlur={validateContact}
              />
            </motion.div>
            {!contactValid && <CursorSVG />}
          </motion.div>

          <motion.div
            animate={
              nameValid && roleValid && contactValid
                ? { opacity: 1, pointerEvents: "auto" }
                : { opacity: 0, pointerEvents: "none" }
            }
            className="flex flex-col justify-start items-start grow min-h-16"
          >
            <Label
              htmlFor="message"
              className="min-h-16 flex justify-center items-center text-md lg:text-2xl"
            >
              {displayedMessageString}
            </Label>
            <Textarea
              {...register("message", { required: true })}
              id="message"
              className="bg-transparent my-1 md:my-4 h-full border border-white text-green-300 text-md lg:text-2xl outline-none"
            />
          </motion.div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!isDirty || !isValid}
              className="w-[300px] bg-white text-black px-4 py-2 rounded text-md lg:text-2xl hover:bg-black hover:text-white"
            >
              Envoyer
            </Button>
          </div>
        </motion.form>
      </div>
      {/* animated div on message sent */}
      <motion.div className="absolute"></motion.div>
    </div>
  );
};

function CursorSVG() {
  return (
    <svg
      viewBox="8 4 8 16"
      xmlns="http://www.w3.org/2000/svg"
      className="cursor"
    >
      <rect x="10" y="6" width="4" height="12" fill="#fff" />
    </svg>
  );
}

export default ContactForm;
