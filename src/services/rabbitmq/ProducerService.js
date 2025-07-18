const amqplib = require('amqplib');
const { AppConfig } = require('../../shareds/AppConfig');

const ProducerService = {
  sendMessage: async (queue, message) => {
    try {
      const connection = await amqplib.connect(AppConfig.rabbitmq.Server);
      const channel = await connection.createChannel();

      await channel.assertQueue(queue, {
        durable: true,
      });

      channel.sendToQueue(queue, Buffer.from(message));

      setTimeout(() => {
        connection.close();
      });
    } catch (error) {
      console.log('Producer error', error.message);
      throw error;
    }
  },
};

module.exports = { ProducerService };
