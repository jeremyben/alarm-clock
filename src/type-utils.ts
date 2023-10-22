/**
 * Convertit des overloads en union.
 * @see https://github.com/microsoft/TypeScript/issues/32164#issuecomment-1146737709
 */
export type OverloadUnion<TOverload extends (...args: any[]) => any> = Exclude<
	OverloadUnionRecursive<(() => never) & TOverload>,
	TOverload extends () => never ? never : () => never
>

type OverloadUnionRecursive<TOverload, TPartialOverload = unknown> = TOverload extends (
	...args: infer TArgs
) => infer TReturn
	? TPartialOverload extends TOverload
		? never
		:
				| OverloadUnionRecursive<
						TPartialOverload & TOverload,
						TPartialOverload & ((...args: TArgs) => TReturn) & Pick<TOverload, keyof TOverload>
				  >
				| ((...args: TArgs) => TReturn)
	: never

/**
 * Convertit une union en tuple (au lieu de simple tableau) pour s'assurer d'avoir toutes les valeurs.
 * @see https://stackoverflow.com/a/73641837/4776628
 */
export type UnionToTuple<T, A extends T[] = []> = TuplifyUnion<T>['length'] extends A['length']
	? [...A]
	: UnionToTuple<T, [T, ...A]>

type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = true extends N
	? []
	: Push<TuplifyUnion<Exclude<T, L>>, L>
type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never
type Push<T extends any[], V> = [...T, V]
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never
