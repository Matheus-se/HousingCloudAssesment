import React from "react";
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";

const defaultMaskOptions = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: false,
    thousandsSeparatorSymbol: "",
    allowDecimal: true,
    decimalSymbol: ".",
    decimalLimit: 15,
    integerLimit: 15,
    allowNegative: true,
    allowLeadingZeroes: false,
};

const FormInputCoordinateText = ({
  error,
  onChange,
  className
}: {
  error: boolean;
  onChange(e: any): void;
  className?: string
}) => {
  const distanceMask = createNumberMask({
    ...defaultMaskOptions,
  });

  return (
    <div>
      <MaskedInput
        onChange={onChange}
        className={
          "w-full rounded border border-black border-opacity-25 bg-transparent p-3 hover:border-opacity-100" + " " + className +
          (error ? " !border-rose-600 !text-rose-600 placeholder-rose-600" : "")
        }
        placeholder={"0.0"}
        mask={distanceMask}
      />
      {error ? <p className="text-rose-600">Field required</p> : null}
    </div>
  );
};

export default FormInputCoordinateText;
