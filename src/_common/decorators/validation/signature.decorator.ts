import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from "class-validator";
import { utils } from "ethers";

@ValidatorConstraint({ async: false })
export class IsValidSignature implements ValidatorConstraintInterface {
	async validate(sign: string, args: ValidationArguments) {
		try {
			const addr = (args.object as any).walletAddress.toLowerCase();
			const signAddr = await utils.verifyMessage(`Signing with acc: ${addr}`, sign);
			if (signAddr.toLowerCase() === addr.toLowerCase()) return true;
			return false;
		} catch (error) {
			return false;
		}
	}

	defaultMessage() {
		return "signature does not match";
	}
}
