from redis import Redis

from platypush.message.response import Response
from platypush.plugins import Plugin


class RedisPlugin(Plugin):
    """
    Plugin to send messages on Redis queues.

    Requires:

        * **redis** (``pip install redis``)
    """

    def send_message(self, queue, msg, *args, **kwargs):
        """
        Send a message to a Redis queu.

        :param queue: Queue name
        :type queue: str

        :param msg: Message to be sent
        :type msg: str, bytes, list, dict, Message object

        :param args: Args passed to the Redis constructor (see https://redis-py.readthedocs.io/en/latest/#redis.Redis)
        :type args: list

        :param kwargs: Kwargs passed to the Redis constructor (see https://redis-py.readthedocs.io/en/latest/#redis.Redis)
        :type kwargs: dict
        """

        redis = Redis(*args, **kwargs)
        redis.rpush(queue, msg)
        return Response(output={'state': 'ok'})


# vim:sw=4:ts=4:et:
