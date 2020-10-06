<?php

namespace Groundhogg\Reporting\New_Reports;

use Groundhogg\Broadcast;
use Groundhogg\Email;
use function Groundhogg\admin_page_url;
use function Groundhogg\get_db;
use function Groundhogg\percentage;

class Table_Top_Performing_Broadcasts extends Base_Email_Performance_Table_Report {

	/**
	 * Get email IDs from broadcasts...
	 *
	 * @return array
	 */
	protected function get_email_ids_of_sent_broadcasts() {

		$broadcasts = get_db( 'broadcasts' )->query( [
			'where' => [
				'relationship' => "AND",
				[ 'col' => 'status', 'val' => 'sent', 'compare' => '=' ],
				[ 'col' => 'object_type', 'val' => 'email', 'compare' => '=' ],
				[ 'col' => 'send_time', 'val' => $this->start, 'compare' => '>=' ],
				[ 'col' => 'send_time', 'val' => $this->end, 'compare' => '<=' ],
			],
		] );

		return wp_parse_id_list( wp_list_pluck( $broadcasts, 'ID' ) );

	}

	protected function should_include( $sent, $opened, $clicked ) {
		return $sent > 10 && percentage( $sent, $opened ) > 20 && percentage( $opened, $clicked ) > 10;
	}

	protected function get_table_data() {
		$broadcasts = $this->get_email_ids_of_sent_broadcasts();

		$list = [];

		foreach ( $broadcasts as $broadcast ) {

			$broadcast_id = is_object( $broadcast ) ? $broadcast->ID : $broadcast;

			$broadcast  = new Broadcast( $broadcast_id );

			$report = $broadcast->get_report_data();

			$title = $broadcast->get_title();

			if ( $this->should_include( $report['sent'], $report['opened'], $report ['clicked'] ) ) {
				$list[] = [
					'label'   => $title,
					'sent'    => $report['sent'],
					'opened'  => percentage( $report['sent'], $report['opened'] ) . '%' ,
					'clicked' => percentage( $report['opened'], $report['clicked'] ) . '%',
					'broadcast' => $broadcast->get_as_array()
				];

			}

		}

		return $list ;
	}

	/**
	 * Sort by multiple args
	 *
	 * @param $a
	 * @param $b
	 *
	 * @return mixed
	 */
	public function sort( $a, $b ) {
		if ( $a['sent'] === $b['sent'] ) {

			if ( $a['opened'] === $b['opened'] ) {
				return $b['clicked'] - $a['clicked'];
			}

			return $b['opened'] - $a['opened'];
		}

		return $b['sent'] - $a['sent'];
	}
}