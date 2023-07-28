import React from "react";
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";

const defaultMaskOptions = {
  prefix: "$",
  suffix: "",
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ",",
  allowDecimal: true,
  decimalSymbol: ".",
  decimalLimit: 2,
  integerLimit: 7,
  allowNegative: false,
  allowLeadingZeroes: false,
};

const FormInputMoneyText = ({
  error,
  onChange,
}: {
  error: boolean;
  onChange(e: any): void;
}) => {
  const currencyMask = createNumberMask({
    ...defaultMaskOptions,
  });

  return (
    <div>
      <MaskedInput
        onChange={onChange}
        className={
          "w-full rounded border border-black border-opacity-25 bg-transparent p-3 hover:border-opacity-100" +
          (error ? " !border-rose-600 !text-rose-600 placeholder-rose-600" : "")
        }
        placeholder={"$0.0"}
        mask={currencyMask}
      />
      {error ? <p className="text-rose-600">Field required</p> : null}
    </div>
  );
};

export default FormInputMoneyText;
