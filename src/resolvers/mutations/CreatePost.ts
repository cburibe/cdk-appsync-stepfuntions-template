import { Context, DynamoDBPutItemRequest, util } from "@aws-appsync/utils";
import { MutationCreatePostArgs, Post } from "../../types/appsync";

export function request(
    ctx: Context<MutationCreatePostArgs>
): DynamoDBPutItemRequest {
    return {
        operation: "PutItem",
        key: util.dynamodb.toMapValues({ id: util.autoId() }),
        attributeValues: util.dynamodb.toMapValues(ctx.args.request)
    };
}

export function response(
    ctx: Context<MutationCreatePostArgs, object, object, object, Post>
) {
    return ctx.result;
}
