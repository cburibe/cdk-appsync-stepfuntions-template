import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import {
  AppsyncTypescriptFunction,
  TSExpressPipelineResolver
} from "cdk-appsync-typescript-resolver";
import { Construct } from "constructs";
import * as path from "path";

const RESOLVERS_MUTATIONS_DIR_PATH = path.join(__dirname, "..", "src", "resolvers", "mutations");
const RESOLVERS_QUERYS_DIR_PATH = path.join(__dirname, "..", "src", "resolvers", "querys");

export class CdkAppsyncStepfuntionsTemplateStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Makes a GraphQL API construct
    const api = new appsync.GraphqlApi(this, "post-apis", {
      name: "api-to-process-posts",
      schema: appsync.SchemaFile.fromAsset("schema.graphql"),
    });

    // Create a DDB table
    const add_ddb_table = new dynamodb.Table(this, "test-table", {
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
    });

    const ddbDataSource = api.addDynamoDbDataSource("testTableDataSource", add_ddb_table);

    // Creates a function for query
    const getPost = new AppsyncTypescriptFunction(this, "GetPostFuntion", {
      name: "GetPost",
      api,
      dataSource: ddbDataSource,
      path: path.join(RESOLVERS_QUERYS_DIR_PATH, "GetPost.ts")
    });

    // Adds a pipeline resolver with the get function
    new TSExpressPipelineResolver(this, "GetPostResolver", {
      api,
      typeName: "Query",
      fieldName: "GetPost",
      tsFunction: getPost,
    });

    // Creates a function for mutation
    const createPost = new AppsyncTypescriptFunction(this, "CreatePostFuntion", {
      name: "CreatePost",
      api,
      dataSource: ddbDataSource,
      path: path.join(RESOLVERS_MUTATIONS_DIR_PATH, "CreatePost.ts")
    });

    // Adds a pipeline resolver with the create function
    new TSExpressPipelineResolver(this, "pipeline-resolver-create-posts", {
      api,
      typeName: "Mutation",
      fieldName: "CreatePost",
      tsFunction: createPost,
    });

    // Prints out URL
    new CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl,
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || "",
    });

    // Prints out the stack region to the terminal
    new CfnOutput(this, "Stack Region", {
      value: this.region,
    });
  }
}
