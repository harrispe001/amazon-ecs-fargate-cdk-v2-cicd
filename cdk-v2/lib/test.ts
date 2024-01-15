import ec2 = require('aws-cdk-lib/aws-ec2');
import ecs = require('aws-cdk-lib/aws-ecs');
import cdk = require('aws-cdk-lib');

export class WillkommenFargate extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'ecs-cdk-vpc', {
        subnetConfiguration: [
          {
            cidrMask: 24,
            name: 'public',
            subnetType: ec2.SubnetType.PUBLIC,
          },
          // {
          //   cidrMask: 24,
          //   name: 'private',
          //   subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          // },
          // Add more subnet configurations as needed for private and isolated subnets
        ],
        // natGateways: 1,
        maxAzs: 3 /* does a sample need 3 az's? */
      });
      
      const cluster = new ecs.Cluster(this, 'service-cluster', {
        clusterName: 'service-cluster',
        containerInsights: true,
        enableFargateCapacityProviders: true,
        vpc: vpc,
      });

    // create a task definition with CloudWatch Logs
    const logging = new ecs.AwsLogDriver({
      streamPrefix: "myapp",
    })

    const taskDef = new ecs.FargateTaskDefinition(this, "MyTaskDefinition", {
      memoryLimitMiB: 512,
      cpu: 256,
    })
    
    const image = ecs.ContainerImage.fromRegistry('amazonlinux:2');
    taskDef.addContainer("AppContainer", {
      image: image,
      logging,
    })

    // Instantiate ECS Service with just cluster and image
    new ecs.FargateService(this, "FargateService", {
      cluster,
      taskDefinition: taskDef
    });
  }
}
